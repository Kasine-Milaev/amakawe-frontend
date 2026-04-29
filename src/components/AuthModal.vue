<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="auth-modal-overlay" @click="close">
        <div class="auth-modal" @click.stop>
          <button class="close-btn" @click="close">×</button>
          
          <h2 class="modal-title">Вход в Amakawe</h2>
          <p class="modal-subtitle">Выберите способ входа</p>
          <div class="auth-buttons">
            <button 
              v-if="isTelegram" 
              class="auth-btn telegram" 
              @click="handleTelegramAuth"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>Telegram</span>
            </button>
            <button class="auth-btn google" @click="handleGoogleAuth">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button class="auth-btn vk" @click="handleVkAuth">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 13.104h-1.596c-.408 0-.532.192-.628.456-.1.264-1.084 1.224-1.404 1.544-.232.232-.42.284-.68.144-.784-.44-2.628-1.804-3.732-3.312-.72-.984-.44-1.416.264-2.136.184-.188 3.348-3.052 3.4-3.308.032-.152-.024-.224-.064-.224-.096 0-1.836 1.168-5.2 3.44-.492.336-.936.504-1.328.492-.444-.012-1.284-.248-1.908-.456-.772-.256-1.38-.384-1.332-.812.032-.224.332-.448.912-.68 3.588-1.56 5.976-2.592 7.172-3.088 3.42-1.424 4.12-1.672 4.588-1.672.1 0 .328.028.48.152.124.1.16.232.172.332-.012.076.012.296-.004.464z"/>
              </svg>
              <span>VK</span>
            </button>
          </div>
          
          <p class="auth-note">
            Нажимая на кнопку, вы соглашаетесь с <a href="#">условиями использования</a>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { tg } from '../plugins/telegram'
import { authService } from '../services/auth'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'authenticated'])

const router = useRouter()
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isTelegram = computed(() => !!tg?.initDataUnsafe?.user)

const close = () => {
  show.value = false
}

const handleTelegramAuth = async () => {
  if (tg?.initDataUnsafe?.user) {
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
    
    const result = await authService.telegramAuth(userData)
    if (result.success) {
      emit('authenticated', result.user)
      close()
    }
  }
}

const handleGoogleAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/google`)
    const data = await response.json()
    
    if (data.authUrl) {
      window.location.href = data.authUrl
    }
  } catch (error) {
    console.error('Google auth error:', error)
  }
}

const handleVkAuth = () => {
  const authUrl = authService.getVkAuthUrl()
  window.location.href = authUrl
}
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
}

.auth-modal {
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #a0aec0;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
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
  margin: 0 0 2rem 0;
  color: #718096;
  text-align: center;
  font-size: 0.95rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.auth-btn.telegram {
  background: linear-gradient(135deg, #0088cc, #00aadd);
}

.auth-btn.google {
  background: #fff;
  color: #333;
}

.auth-btn.vk {
  background: linear-gradient(135deg, #0077ff, #0088ff);
}

.btn-icon {
  width: 24px;
  height: 24px;
}

.auth-note {
  margin: 0;
  font-size: 0.8rem;
  color: #4a5568;
  text-align: center;
  line-height: 1.5;
}

.auth-note a {
  color: #667eea;
  text-decoration: none;
}

.auth-note a:hover {
  text-decoration: underline;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>