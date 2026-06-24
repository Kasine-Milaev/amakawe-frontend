<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-profile">
      <div class="spinner"></div>
      <p>Загрузка профиля...</p>
    </div>
    
    <div v-else-if="!isLoggedIn" class="not-logged-in">
      <h2>Войдите в аккаунт</h2>
      <p>Чтобы просматривать профиль, необходимо авторизоваться</p>
      <button class="btn btn-primary" @click="showAuth = true">
        <LogIn class="icon" />
        Войти
      </button>
    </div>
    
    <div v-else class="profile-content">
      <div class="profile-banner" :style="{ backgroundImage: user.banner ? `url(${user.banner})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }">
        <div class="banner-overlay"></div>
      </div>
      
      <div class="profile-header">
        <div class="avatar-container">
          <img 
            :src="userAvatar" 
            :alt="user.username"
            class="avatar"
          />
          <button v-if="isOwnProfile" class="edit-avatar-btn" @click="showAvatarCropper = true">
            <Camera class="icon" />
          </button>
        </div>
        
        <div class="profile-info">
          <h1 class="username">{{ user.username || 'Аноним' }}</h1>
          <p v-if="user.email" class="user-email">{{ user.email }}</p>
          
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-value">{{ user.rating || 0 }}</span>
              <span class="stat-label">Рейтинг</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ animeListsCount }}</span>
              <span class="stat-label">Аниме</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ user.comments_count || 0 }}</span>
              <span class="stat-label">Коммент.</span>
            </div>
          </div>
          
          <div class="profile-meta">
            <span class="meta-item">
              <Calendar class="icon" />
              {{ formatDate(user.created_at) }}
            </span>
          </div>
        </div>
        
        <div v-if="isOwnProfile" class="profile-actions">
          <button class="btn btn-secondary" @click="showEditModal = true">
            <Edit2 class="icon" />
            Редактировать
          </button>
          <button class="btn btn-secondary" @click="$router.push('/settings')">
            <Settings class="icon" />
            Настройки
          </button>
        </div>
      </div>
      
      <div class="profile-body">
        <div class="profile-sidebar">
          <nav class="profile-nav">
            <button 
              :class="['nav-item', { active: activeTab === 'about' }]"
              @click="activeTab = 'about'"
            >
              <User class="icon" />
              О себе
            </button>
            <button 
              :class="['nav-item', { active: activeTab === 'activity' }]"
              @click="activeTab = 'activity'"
            >
              <Activity class="icon" />
              Активность
            </button>
            <button 
              :class="['nav-item', { active: activeTab === 'lists' }]"
              @click="activeTab = 'lists'"
            >
              <List class="icon" />
              Списки
            </button>
            <button 
              :class="['nav-item', { active: activeTab === 'favorites' }]"
              @click="activeTab = 'favorites'"
            >
              <Heart class="icon" />
              Избранное
            </button>
          </nav>
        </div>
        
        <div class="profile-main">
          <div v-if="activeTab === 'about'" class="tab-content">
            <h2 class="tab-title">О себе</h2>
            <div v-if="user.bio" class="bio-content">
              {{ user.bio }}
            </div>
            <div v-else class="empty-state">
              <User class="icon" />
              <p>Пользователь не написал о себе</p>
              <button v-if="isOwnProfile" class="btn btn-primary" @click="showEditModal = true">
                Добавить информацию
              </button>
            </div>
          </div>
          
          <div v-if="activeTab === 'activity'" class="tab-content">
            <h2 class="tab-title">Активность</h2>
            <div v-if="activity.history && activity.history.length > 0" class="activity-list">
              <div v-for="(item, index) in activity.history" :key="index" class="activity-item">
                <div class="activity-icon" :class="getStatusColor(item.action)">
                  <PlayCircle v-if="item.action === 'watching'" class="icon" />
                  <CheckCircle v-else-if="item.action === 'completed'" class="icon" />
                  <Clock v-else-if="item.action === 'planned'" class="icon" />
                  <XCircle v-else-if="item.action === 'dropped'" class="icon" />
                  <PauseCircle v-else class="icon" />
                </div>
                <div class="activity-info">
                  <p class="activity-text">
                    <strong>{{ getActionText(item.action) }}</strong>
                    аниме #{{ item.animeId }}
                  </p>
                  <span class="activity-time">{{ formatRelativeTime(item.viewedAt) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <Activity class="icon" />
              <p>Пока нет активности</p>
            </div>
          </div>
          
          <div v-if="activeTab === 'lists'" class="tab-content">
            <h2 class="tab-title">Списки аниме</h2>
            <div class="lists-grid">
              <div class="list-card watching">
                <div class="list-header">
                  <Tv class="icon" />
                  <h3>Смотрю</h3>
                  <span class="list-count">{{ activity.animeLists?.watching?.length || 0 }}</span>
                </div>
                <div class="list-items">
                  <div v-for="id in (activity.animeLists?.watching || []).slice(0, 5)" :key="id" class="anime-item">
                    <router-link :to="`/anime/${id}`" class="anime-link">#{{ id }}</router-link>
                  </div>
                  <span v-if="(activity.animeLists?.watching || []).length > 5" class="list-more">
                    +{{ (activity.animeLists?.watching || []).length - 5 }} ещё
                  </span>
                </div>
              </div>
              
              <div class="list-card planned">
                <div class="list-header">
                  <Calendar class="icon" />
                  <h3>В планах</h3>
                  <span class="list-count">{{ activity.animeLists?.planned?.length || 0 }}</span>
                </div>
                <div class="list-items">
                  <div v-for="id in (activity.animeLists?.planned || []).slice(0, 5)" :key="id" class="anime-item">
                    <router-link :to="`/anime/${id}`" class="anime-link">#{{ id }}</router-link>
                  </div>
                  <span v-if="(activity.animeLists?.planned || []).length > 5" class="list-more">
                    +{{ (activity.animeLists?.planned || []).length - 5 }} ещё
                  </span>
                </div>
              </div>
              
              <div class="list-card completed">
                <div class="list-header">
                  <CheckCircle class="icon" />
                  <h3>Просмотрено</h3>
                  <span class="list-count">{{ activity.animeLists?.completed?.length || 0 }}</span>
                </div>
                <div class="list-items">
                  <div v-for="id in (activity.animeLists?.completed || []).slice(0, 5)" :key="id" class="anime-item">
                    <router-link :to="`/anime/${id}`" class="anime-link">#{{ id }}</router-link>
                  </div>
                  <span v-if="(activity.animeLists?.completed || []).length > 5" class="list-more">
                    +{{ (activity.animeLists?.completed || []).length - 5 }} ещё
                  </span>
                </div>
              </div>
              
              <div class="list-card on-hold">
                <div class="list-header">
                  <PauseCircle class="icon" />
                  <h3>Отложено</h3>
                  <span class="list-count">{{ activity.animeLists?.onHold?.length || 0 }}</span>
                </div>
                <div class="list-items">
                  <div v-for="id in (activity.animeLists?.onHold || []).slice(0, 5)" :key="id" class="anime-item">
                    <router-link :to="`/anime/${id}`" class="anime-link">#{{ id }}</router-link>
                  </div>
                  <span v-if="(activity.animeLists?.onHold || []).length > 5" class="list-more">
                    +{{ (activity.animeLists?.onHold || []).length - 5 }} ещё
                  </span>
                </div>
              </div>
              
              <div class="list-card dropped">
                <div class="list-header">
                  <XCircle class="icon" />
                  <h3>Брошено</h3>
                  <span class="list-count">{{ activity.animeLists?.dropped?.length || 0 }}</span>
                </div>
                <div class="list-items">
                  <div v-for="id in (activity.animeLists?.dropped || []).slice(0, 5)" :key="id" class="anime-item">
                    <router-link :to="`/anime/${id}`" class="anime-link">#{{ id }}</router-link>
                  </div>
                  <span v-if="(activity.animeLists?.dropped || []).length > 5" class="list-more">
                    +{{ (activity.animeLists?.dropped || []).length - 5 }} ещё
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'favorites'" class="tab-content">
            <h2 class="tab-title">Избранное</h2>
            <div v-if="user.favorites && user.favorites.length > 0" class="favorites-grid">
              <div v-for="id in user.favorites" :key="id" class="favorite-card">
                <router-link :to="`/anime/${id}`" class="favorite-link">
                  Аниме #{{ id }}
                </router-link>
              </div>
            </div>
            <div v-else class="empty-state">
              <Heart class="icon" />
              <p>Пока нет избранных аниме</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal" @click.stop>
        <h2>Редактировать профиль</h2>
        <div class="form-group">
          <label>Имя пользователя</label>
          <input v-model="editForm.username" type="text" placeholder="username" />
        </div>
        <div class="form-group">
          <label>О себе</label>
          <textarea v-model="editForm.bio" rows="4" placeholder="Расскажите о себе..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showEditModal = false">Отмена</button>
          <button class="btn btn-primary" @click="updateProfile" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
    
    <AvatarCropper 
      v-model:show="showAvatarCropper"
      @uploaded="handleAvatarUploaded"
    />
    <AuthModal v-model="showAuth" @authenticated="handleAuthenticated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Camera, Edit2, User, Activity, List, LogIn, Settings, Heart,
  Calendar, Clock, Tv, CheckCircle, XCircle, PlayCircle, 
  PauseCircle
} from 'lucide-vue-next'
import AvatarCropper from '../components/AvatarCropper.vue'
import AuthModal from '../components/AuthModal.vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://amakawe-backendd.vercel.app'

const route = useRoute()
const router = useRouter()
const user = ref({})
const activity = ref({})
const loading = ref(true)
const activeTab = ref('about')
const isOwnProfile = ref(false)
const isLoggedIn = ref(false)
const showEditModal = ref(false)
const showAvatarCropper = ref(false)
const showAuth = ref(false)

const editForm = ref({
  username: '',
  bio: ''
})

const userId = computed(() => route.params.id)

const userAvatar = computed(() => {
  if (user.value.avatar) return user.value.avatar
  if (user.value.username) {
    return `https://ui-avatars.com/api/?name=${user.value.username}&background=667eea&color=fff&size=200`
  }
  return `https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=200`
})

const animeListsCount = computed(() => {
  const lists = activity.value.animeLists || {}
  return (lists.watching?.length || 0) + 
         (lists.planned?.length || 0) + 
         (lists.completed?.length || 0) + 
         (lists.onHold?.length || 0) + 
         (lists.dropped?.length || 0)
})

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      isLoggedIn.value = false
      loading.value = false
      console.warn('No token found')
      return
    }
    
    isLoggedIn.value = true
    
    const url = userId.value 
      ? `${API_URL}/api/profile/${userId.value}`
      : `${API_URL}/api/profile/me`
    
    console.log('Fetching profile from:', url)
    
    const response = await fetch(url, { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log('Profile data:', data)
    
    if (data.success) {
      user.value = data.user
      editForm.value = {
        username: data.user.username || '',
        bio: data.user.bio || ''
      }
      
      if (!userId.value) {
        isOwnProfile.value = true
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      await fetchActivity()
    } else {
      console.error('Profile fetch failed:', data.error)
      isLoggedIn.value = false
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    isLoggedIn.value = false
  } finally {
    loading.value = false
  }
}

const fetchActivity = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    const url = userId.value
      ? `${API_URL}/api/profile/${userId.value}/activity`
      : `${API_URL}/api/profile/me/activity`
    
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    
    const response = await fetch(url, { headers })
    const data = await response.json()
    
    if (data.success) {
      activity.value = data.activity
    }
  } catch (error) {
    console.error('Failed to fetch activity:', error)
  }
}

const updateProfile = async () => {
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
        username: editForm.value.username,
        bio: editForm.value.bio
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      user.value = { ...user.value, ...data.user }
      showEditModal.value = false
      await fetchProfile()
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

const handleAvatarUploaded = (avatarUrl) => {
  user.value.avatar = avatarUrl
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  localStorage.setItem('user', JSON.stringify({
    ...storedUser,
    avatar: avatarUrl
  }))
}

const handleAuthenticated = (userData) => {
  user.value = userData
  isLoggedIn.value = true
  fetchProfile()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'давно'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Только что'
  if (minutes < 60) return `${minutes} мин. назад`
  if (hours < 24) return `${hours} ч. назад`
  if (days < 7) return `${days} дн. назад`
  
  return formatDate(dateString)
}

const getActionText = (action) => {
  const texts = {
    watching: 'Начал просмотр',
    completed: 'Завершил просмотр',
    planned: 'Добавил в планы',
    dropped: 'Бросил',
    on_hold: 'Приостановил'
  }
  return texts[action] || action
}

const getStatusColor = (action) => {
  const colors = {
    watching: 'status-watching',
    completed: 'status-completed',
    planned: 'status-planned',
    dropped: 'status-dropped',
    on_hold: 'status-hold'
  }
  return colors[action] || ''
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #0f0f1a;
  padding-top: 70px;
}

.loading-profile, .not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #fff;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-banner {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, #0f0f1a 100%);
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  margin-top: -100px;
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  border: 4px solid #1a1a2e;
  object-fit: cover;
  background: #1a1a2e;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.edit-avatar-btn:hover {
  background: #764ba2;
}

.profile-info {
  flex: 1;
  color: white;
}

.username {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.user-email {
  margin: 0 0 1rem 0;
  color: #718096;
  font-size: 1rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

.profile-meta {
  display: flex;
  gap: 1rem;
  color: #718096;
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 18px;
  height: 18px;
}

.profile-body {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
  height: fit-content;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  color: #718096;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.profile-main {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
}

.tab-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: white;
}

.tab-content {
  color: #a0aec0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #718096;
}

.empty-state .icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
}

.activity-icon.status-watching { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.activity-icon.status-completed { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.activity-icon.status-planned { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
.activity-icon.status-hold { background: rgba(234, 179, 8, 0.2); color: #eab308; }
.activity-icon.status-dropped { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.activity-info {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: #e2e8f0;
}

.activity-time {
  font-size: 0.875rem;
  color: #718096;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.list-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1.25rem;
  border-top: 3px solid transparent;
}

.list-card.watching { border-top-color: #22c55e; }
.list-card.planned { border-top-color: #a855f7; }
.list-card.completed { border-top-color: #3b82f6; }
.list-card.on-hold { border-top-color: #eab308; }
.list-card.dropped { border-top-color: #ef4444; }

.list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: white;
}

.list-header h3 {
  margin: 0;
  font-size: 1rem;
  flex: 1;
}

.list-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.list-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.anime-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.anime-link {
  color: #a0aec0;
  text-decoration: none;
}

.anime-link:hover {
  color: #667eea;
}

.list-more {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #718096;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.favorite-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
}

.favorite-link {
  color: #667eea;
  text-decoration: none;
}

.favorite-link:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
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

.modal h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a0aec0;
  font-size: 0.9rem;
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

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-meta {
    justify-content: center;
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .profile-body {
    grid-template-columns: 1fr;
  }
  
  .profile-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .avatar {
    width: 150px;
    height: 150px;
  }
}
</style>
