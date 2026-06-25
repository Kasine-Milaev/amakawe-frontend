<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1 class="page-title">Настройки профиля</h1>
      
      <div class="settings-grid">
        <div class="settings-card">
          <div class="card-header">
            <User class="icon" />
            <h2>Аватар</h2>
          </div>
          <div class="avatar-preview">
            <img :src="userAvatar" :alt="user.username" class="avatar" />
            <button class="change-avatar-btn" @click="showAvatarCropper = true">
              <Camera class="icon" />
              Изменить
            </button>
          </div>
        </div>
        
        <div class="settings-card">
          <div class="card-header">
            <Image class="icon" />
            <h2>Баннер профиля</h2>
          </div>
          <div class="banner-preview" :style="{ backgroundImage: `url(${bannerPreview})` }">
            <div class="banner-overlay">
              <button class="btn btn-secondary" @click="showBannerModal = true">
                <Upload class="icon" />
                Загрузить баннер
              </button>
              <button v-if="user.banner" class="btn btn-danger" @click="removeBanner">
                <Trash2 class="icon" />
                Удалить
              </button>
            </div>
          </div>
        </div>
        
        <div class="settings-card">
          <div class="card-header">
            <Lock class="icon" />
            <h2>Безопасность</h2>
          </div>
          <div class="form-group">
            <label>Текущий пароль</label>
            <input v-model="passwordForm.current" type="password" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Новый пароль</label>
            <input v-model="passwordForm.new" type="password" placeholder="Минимум 6 символов" />
          </div>
          <div class="form-group">
            <label>Подтвердите пароль</label>
            <input v-model="passwordForm.confirm" type="password" placeholder="••••••••" />
          </div>
          <button class="btn btn-primary" @click="changePassword" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сменить пароль' }}
          </button>
        </div>`
        
        <div class="settings-card">
          <div class="card-header">
            <Mail class="icon" />
            <h2>Email</h2>
          </div>
          <div class="form-group">
            <label>Email адрес</label>
            <input v-model="emailForm.email" type="email" :placeholder="user.email || 'Не указан'" />
            <p class="hint">Привяжите email для восстановления аккаунта</p>
          </div>
          <button class="btn btn-primary" @click="updateEmail" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить email' }}
          </button>
        </div>
        
        <div class="settings-card">
          <div class="card-header">
            <User class="icon" />
            <h2>Информация</h2>
          </div>
          <div class="form-group">
            <label>Имя пользователя</label>
            <input v-model="infoForm.username" type="text" placeholder="username" />
          </div>
          <div class="form-group">
            <label>О себе</label>
            <textarea v-model="infoForm.bio" rows="4" placeholder="Расскажите о себе..."></textarea>
          </div>
          <button class="btn btn-primary" @click="updateInfo" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
        
        <div class="settings-card danger-zone">
          <div class="card-header">
            <AlertTriangle class="icon danger" />
            <h2>Опасная зона</h2>
          </div>
          <p class="danger-text">Эти действия необратимы. Пожалуйста, будьте осторожны.</p>
          <button class="btn btn-danger" @click="showDeleteConfirm = true">
            <Trash2 class="icon" />
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showBannerModal" class="modal-overlay" @click="showBannerModal = false">
      <div class="modal" @click.stop>
        <h2>Загрузка баннера</h2>
        <div class="form-group">
          <label>URL изображения</label>
          <input v-model="bannerUrl" type="url" placeholder="https://example.com/image.jpg" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showBannerModal = false">Отмена</button>
          <button class="btn btn-primary" @click="updateBanner" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal danger" @click.stop>
        <h2>Удалить аккаунт?</h2>
        <p>Это действие нельзя отменить. Все данные будут удалены навсегда.</p>
        <div class="form-group">
          <label>Введите ваш пароль для подтверждения</label>
          <input v-model="deletePassword" type="password" placeholder="••••••••" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showDeleteConfirm = false">Отмена</button>
          <button class="btn btn-danger" @click="deleteAccount" :disabled="loading">
            {{ loading ? 'Удаление...' : 'Удалить аккаунт' }}
          </button>
        </div>
      </div>
    </div>
    
    <AvatarCropper v-model:show="showAvatarCropper" @uploaded="handleAvatarUploaded" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Image, Lock, Mail, AlertTriangle, Trash2, 
  Camera, Upload
} from 'lucide-vue-next'
import AvatarCropper from '../components/AvatarCropper.vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://amakawe-backendd.vercel.app'
const router = useRouter()

const user = ref({})
const loading = ref(false)
const showAvatarCropper = ref(false)
const showBannerModal = ref(false)
const showDeleteConfirm = ref(false)
const bannerUrl = ref('')
const deletePassword = ref('')

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const emailForm = ref({
  email: ''
})

const infoForm = ref({
  username: '',
  bio: ''
})

const userAvatar = computed(() => {
  if (user.value?.avatar) return user.value.avatar
  if (user.value?.username) {
    return `https://ui-avatars.com/api/?name=${user.value.username}&background=667eea&color=fff&size=200`
  }
  return `https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=200`
})

const bannerPreview = computed(() => {
  return user.value?.banner || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
})

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth')
      return
    }
    
    const response = await fetch(`${API_URL}/api/profile/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value = data.user
      infoForm.value = {
        username: data.user.username || '',
        bio: data.user.bio || ''
      }
      emailForm.value.email = data.user.email || ''
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
}

const handleAvatarUploaded = (avatarUrl) => {
  user.value.avatar = avatarUrl
}

const updateBanner = async () => {
  if (!bannerUrl.value) {
    alert('Введите URL изображения')
    return
  }
  
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/profile/me/banner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ banner: bannerUrl.value })
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value.banner = data.banner
      showBannerModal.value = false
      bannerUrl.value = ''
      alert('Баннер обновлён!')
    }
  } catch (error) {
    console.error('Failed to update banner:', error)
    alert('Ошибка при обновлении баннера')
  } finally {
    loading.value = false
  }
}

const removeBanner = async () => {
  if (!confirm('Удалить баннер?')) return
  
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/profile/me/banner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ banner: '' })
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value.banner = null
      alert('Баннер удалён!')
    }
  } catch (error) {
    console.error('Failed to remove banner:', error)
    alert('Ошибка при удалении баннера')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    alert('Заполните все поля')
    return
  }
  
  if (passwordForm.value.new.length < 6) {
    alert('Пароль должен быть не менее 6 символов')
    return
  }
  
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Пароли не совпадают')
    return
  }
  
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    
    const loginResponse = await fetch(`${API_URL}/api/auth/email/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.value.email,
        password: passwordForm.value.current
      })
    })
    
    if (!loginResponse.ok) {
      alert('Неверный текущий пароль')
      return
    }
    
    const response = await fetch(`${API_URL}/api/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        password: passwordForm.value.new
      })
    })
    
    if (response.ok) {
      alert('Пароль успешно изменён!')
      passwordForm.value = { current: '', new: '', confirm: '' }
    } else {
      alert('Ошибка при смене пароля')
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    alert('Ошибка при смене пароля')
  } finally {
    loading.value = false
  }
}

const updateEmail = async () => {
  if (!emailForm.value.email) {
    alert('Введите email')
    return
  }
  
  if (!emailForm.value.email.includes('@')) {
    alert('Введите корректный email')
    return
  }
  
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email: emailForm.value.email })
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value.email = data.user.email
      alert('Email успешно обновлён!')
    }
  } catch (error) {
    console.error('Failed to update email:', error)
    alert('Ошибка при обновлении email')
  } finally {
    loading.value = false
  }
}

const updateInfo = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: infoForm.value.username,
        bio: infoForm.value.bio
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value.username = data.user.username
      user.value.bio = data.user.bio
      alert('Информация обновлена!')
    }
  } catch (error) {
    console.error('Failed to update info:', error)
    alert('Ошибка при обновлении информации')
  } finally {
    loading.value = false
  }
}

const deleteAccount = async () => {
  if (!deletePassword.value) {
    alert('Введите пароль для подтверждения')
    return
  }
  
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/api/profile/me/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ password: deletePassword.value })
    })
    
    if (response.ok) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      alert('Аккаунт удалён')
      router.push('/')
    } else {
      alert('Неверный пароль или ошибка при удалении')
    }
  } catch (error) {
    console.error('Failed to delete account:', error)
    alert('Ошибка при удалении аккаунта')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #0f0f1a;
  padding-top: 70px;
  padding-bottom: 3rem;
}

.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  color: white;
  text-align: center;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: white;
}

.icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.icon.danger {
  color: #ef4444;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 16px;
  border: 4px solid #1a1a2e;
  object-fit: cover;
}

.change-avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.change-avatar-btn:hover {
  background: rgba(102, 126, 234, 0.3);
}

.banner-preview {
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.banner-preview:hover .banner-overlay {
  opacity: 1;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: white;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #718096;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-zone {
  border-color: rgba(239, 68, 68, 0.3);
}

.danger-text {
  color: #fca5a5;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
}

.modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  color: white;
}

.modal.danger {
  border-color: rgba(239, 68, 68, 0.3);
}

.modal h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.modal p {
  color: #a0aec0;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-container {
    padding: 1rem;
  }
}
</style>