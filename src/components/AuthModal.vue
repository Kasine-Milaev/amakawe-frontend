<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="auth-modal-overlay" @click="close">
        <div class="auth-modal" @click.stop>
          <button class="close-btn" @click="close">×</button>
          
          <h2 class="modal-title">Вход в Amakawe</h2>
          <p class="modal-subtitle">Выберите способ входа</p>
          
          <div v-if="step === 'method'" class="auth-methods">
            <div class="login-form">
              <div class="form-group">
                <label>Логин</label>
                <input
                  v-model="loginForm.username"
                  type="text"
                  placeholder="username"
                  :disabled="loading"
                  autocomplete="username"
                />
              </div>
              
              <div class="form-group">
                <label>Пароль</label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="••••••••"
                  :disabled="loading"
                  autocomplete="current-password"
                />
              </div>
              
              <button 
                class="submit-btn" 
                @click="handleLogin"
                :disabled="loading || !loginForm.username || !loginForm.password"
              >
                {{ loading ? 'Вход...' : 'Войти' }}
              </button>
              
              <div class="divider">
                <span>или</span>
              </div>
              
              <button class="auth-btn telegram" @click="handleTelegramAuth">
                <Send class="btn-icon" />
                <span>Через Telegram</span>
              </button>
              
              <button class="auth-btn register" @click="step = 'register'">
                <UserPlus class="btn-icon" />
                <span>Создать аккаунт</span>
              </button>
            </div>
          </div>
          
          <div v-if="step === 'register'" class="auth-form">
            <button class="back-btn" @click="step = 'method'">
              <ArrowLeft class="btn-icon" /> Назад
            </button>
            
            <h3 class="form-title">Создание аккаунта</h3>
            
            <div class="form-group">
              <label>Логин</label>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="Придумайте логин"
                :disabled="loading"
                autocomplete="username"
              />
            </div>
            
            <div class="form-group">
              <label>Пароль</label>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="Минимум 6 символов"
                :disabled="loading"
                autocomplete="new-password"
              />
            </div>
            
            <div class="form-group">
              <label>Повторите пароль</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                :disabled="loading"
                autocomplete="new-password"
              />
            </div>
            
            <button 
              class="submit-btn" 
              @click="handleRegister"
              :disabled="loading || !registerForm.username || !registerForm.password"
            >
              {{ loading ? 'Создание...' : 'Создать аккаунт' }}
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
import { Send, ArrowLeft, AlertCircle, UserPlus } from 'lucide-vue-next'
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
const loading = ref(false)
const error = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const resetForm = () => {
  step.value = 'method'
  loginForm.value = { username: '', password: '' }
  registerForm.value = { username: '', password: '', confirmPassword: '' }
  loading.value = false
  error.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.value.username.toLowerCase(),
        password: loginForm.value.password
      })
    })
    
    const data = await response.json()
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      emit('authenticated', data.user)
      close()
    } else {
      error.value = data.error || 'Неверный логин или пароль'
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    loading.value = false
    return
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerForm.value.username.toLowerCase(),
        password: registerForm.value.password
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
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.form-title {
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
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

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  color: #718096;
  font-size: 0.875rem;
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

.auth-btn.telegram:hover {
  border-color: #0088cc;
  background: rgba(0, 136, 204, 0.15);
}

.auth-btn.register:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
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