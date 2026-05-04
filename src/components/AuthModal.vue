<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="auth-modal-overlay" @click="close">
        <div class="auth-modal" @click.stop>
          <button class="close-btn" @click="close">×</button>
          
          <h2 class="modal-title">Вход в Amakawe</h2>
          <p class="modal-subtitle">Выберите способ входа</p>
          
          <div v-if="step === 'method'" class="auth-methods">
            <button class="auth-btn email" @click="step = 'email'">
              <Mail class="btn-icon" />
              <span>Через Email</span>
            </button>
            
            <button class="auth-btn telegram" @click="handleTelegramAuth">
              <Send class="btn-icon" />
              <span>Через Telegram</span>
            </button>
          </div>
          
          <div v-if="step === 'email'" class="auth-form">
            <button class="back-btn" @click="step = 'method'">
              <ArrowLeft class="btn-icon" /> Назад
            </button>
            
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="your@email.com"
                :disabled="loading"
              />
            </div>
            
            <button 
              class="submit-btn" 
              @click="requestCode"
              :disabled="loading || !email"
            >
              {{ loading ? 'Отправка...' : 'Получить код' }}
            </button>
          </div>
          
          <div v-if="step === 'code'" class="auth-form">
            <button class="back-btn" @click="step = 'email'">
              <ArrowLeft class="btn-icon" /> Назад
            </button>
            
            <p class="form-hint">Код отправлен на {{ email }}</p>
            
            <div class="form-group">
              <label>Код подтверждения</label>
              <input
                v-model="code"
                type="text"
                placeholder="123456"
                maxlength="6"
                :disabled="loading"
                class="code-input"
              />
            </div>
            
            <button 
              class="submit-btn" 
              @click="verifyCode"
              :disabled="loading || !code"
            >
              {{ loading ? 'Проверка...' : 'Подтвердить' }}
            </button>
            
            <button class="resend-btn" @click="requestCode" :disabled="resendTimer > 0">
              {{ resendTimer > 0 ? `Отправить повторно (${resendTimer}s)` : 'Отправить код снова' }}
            </button>
          </div>
          
          <div v-if="step === 'register'" class="auth-form">
            <button class="back-btn" @click="step = 'email'">
              <ArrowLeft class="btn-icon" /> Назад
            </button>
            
            <p class="form-hint">Создайте аккаунт</p>
            
            <div class="form-group">
              <label>Имя пользователя</label>
              <input
                v-model="username"
                type="text"
                placeholder="username"
                :disabled="loading"
              />
            </div>
            
            <div class="form-group">
              <label>Пароль</label>
              <input
                v-model="password"
                type="password"
                placeholder="Минимум 6 символов"
                :disabled="loading"
              />
            </div>
            
            <button 
              class="submit-btn" 
              @click="register"
              :disabled="loading || !password"
            >
              {{ loading ? 'Создание...' : 'Создать аккаунт' }}
            </button>
          </div>
          
          <div v-if="step === 'login'" class="auth-form">
            <button class="back-btn" @click="step = 'email'">
              <ArrowLeft class="btn-icon" /> Назад
            </button>
            
            <p class="form-hint">Введите пароль</p>
            
            <div class="form-group">
              <label>Пароль</label>
              <input
                v-model="password"
                type="password"
                placeholder="Ваш пароль"
                :disabled="loading"
              />
            </div>
            
            <button 
              class="submit-btn" 
              @click="login"
              :disabled="loading || !password"
            >
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>
          </div>
          
          <div v-if="error" class="error-message">
            <AlertCircle class="error-icon" />
            {{ error }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Mail, Send, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { tg } from '../plugins/telegram'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'authenticated'])

const API_URL = import.meta.env.VITE_API_URL || 'https://amakawe-backendd.vercel.app'

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const close = () => {
  show.value = false
  resetForm()
}

const step = ref('method')
const email = ref('')
const code = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const resendTimer = ref(0)

const resetForm = () => {
  step.value = 'method'
  email.value = ''
  code.value = ''
  username.value = ''
  password.value = ''
  loading.value = false
  error.value = ''
  resendTimer.value = 0
}

const handleTelegramAuth = async () => {
  if (!tg?.initDataUnsafe?.user) {
    error.value = 'Откройте в Telegram для авторизации'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const userData = {
      id: tg.initDataUnsafe.user.id,
      username: tg.initDataUnsafe.user.username,
      first_name: tg.initDataUnsafe.user.first_name,
      last_name: tg.initDataUnsafe.user.last_name,
      photo_url: tg.initDataUnsafe.user.photo_url,
      is_premium: tg.initDataUnsafe.user.is_premium,
      language_code: tg.initDataUnsafe.user.language_code,
      hash: tg.initData?.split('hash=')[1]
    }
    
    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      emit('authenticated', data.user)
      close()
    } else {
      error.value = data.error || 'Ошибка авторизации'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}

const requestCode = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/email/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await response.json()
    
    if (data.success) {
      step.value = 'code'
      resendTimer.value = 60
      startResendTimer()
      
      if (data.code) {
        code.value = data.code
      }
    } else {
      error.value = data.error || 'Не удалось отправить код'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}

const startResendTimer = () => {
  const interval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const verifyCode = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/email/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: code.value })
    })
    
    const data = await response.json()
    
    if (data.success && data.verified) {
      if (data.needsRegistration) {
        step.value = 'register'
      } else if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        emit('authenticated', data.user)
        close()
      } else {
        step.value = 'login'
      }
    } else {
      error.value = data.error || 'Неверный код'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}

const register = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/email/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        username: username.value || email.value.split('@')[0]
      })
    })
    
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      emit('authenticated', data.user)
      close()
    } else {
      error.value = data.error || 'Не удалось создать аккаунт'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}

const login = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/email/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      emit('authenticated', data.user)
      close()
    } else {
      error.value = data.error || 'Неверный email или пароль'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.auth-modal {
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #718096;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.modal-subtitle {
  margin: 0 0 1.5rem 0;
  color: #718096;
  text-align: center;
  font-size: 0.95rem;
}

.auth-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.auth-btn.email:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

.auth-btn.telegram:hover {
  border-color: #0088cc;
  background: rgba(0, 136, 204, 0.15);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #718096;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: -0.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.05);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.code-input {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 0.5rem;
  font-weight: 700;
}

.form-hint {
  color: #718096;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.submit-btn {
  padding: 1rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.resend-btn {
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #718096;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.resend-btn:hover:not(:disabled) {
  color: #667eea;
  border-color: #667eea;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #fca5a5;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .auth-modal,
.modal-leave-active .auth-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .auth-modal,
.modal-leave-to .auth-modal {
  transform: scale(0.95) translateY(-10px);
}

@media (max-width: 480px) {
  .auth-modal {
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
}
</style>