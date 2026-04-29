<template>
  <nav class="top-navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <span class="logo-text">Amakawe</span>
      </router-link>

      <div class="nav-menu">
        <router-link to="/" class="nav-item active">
          <Grid3X3 class="icon" />
          <span>Аниме</span>
        </router-link>
        
        <router-link to="/collections" class="nav-item">
          <Folder class="icon" />
          <span>Коллекции</span>
        </router-link>
        
        <router-link to="/random" class="nav-item">
          <Dice5 class="icon" />
          <span>Рандом</span>
        </router-link>

        <div class="dropdown">
          <button class="nav-item dropdown-toggle">
            <MoreHorizontal class="icon" />
          </button>
          <div class="dropdown-menu">
            <router-link to="/genres" class="dropdown-item">
              <Tags class="icon-small" />
              Жанры
            </router-link>
            <router-link to="/type/tv" class="dropdown-item">
              <Tv class="icon-small" />
              Сериалы
            </router-link>
            <router-link to="/type/movie" class="dropdown-item">
              <Film class="icon-small" />
              Фильмы
            </router-link>
            <router-link to="/type/ova" class="dropdown-item">
              <Disc class="icon-small" />
              OVA
            </router-link>
            <router-link to="/type/ona" class="dropdown-item">
              <Globe class="icon-small" />
              ONA
            </router-link>
            <router-link to="/type/special" class="dropdown-item">
              <Star class="icon-small" />
              Спешлы
            </router-link>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <button class="search-btn" @click="toggleSearch">
          <Search class="icon" />
        </button>
        
        <div class="user-profile">
          <button v-if="!currentUser" class="login-btn" @click="showAuth = true">
            <LogIn class="avatar-icon" />
            <span class="login-text">Войти</span>
          </button>
          
          <div v-else class="user-avatar-wrapper">
            <div class="avatar" v-if="currentUser.photo_url">
              <img :src="currentUser.photo_url" :alt="currentUser.username" class="avatar-img" />
            </div>
            <div class="avatar" v-else>
              <User class="avatar-icon" />
            </div>
            <span v-if="currentUser.username" class="username">@{{ currentUser.username }}</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="search-modal">
        <div v-if="showSearch" class="search-modal-overlay" @click="toggleSearch">
          <div class="search-modal" @click.stop>
            <div class="search-input-wrapper">
              <Search class="search-icon" />
              <input
                v-model="searchInput"
                type="text"
                placeholder="Поиск аниме..."
                class="search-input"
                @keyup.enter="performSearch"
                ref="searchInputRef"
                autofocus
              />
            </div>
            <div v-if="searchResults.length" class="search-results">
              <router-link
                v-for="anime in searchResults"
                :key="anime.id"
                :to="`/anime/${anime.id}`"
                class="search-result-item"
                @click="toggleSearch"
              >
                <img :src="getImageUrl(anime.image)" :alt="getTitle(anime)" class="result-image" />
                <div class="result-info">
                  <h4>{{ getTitle(anime) }}</h4>
                  <span class="result-type">{{ getTypeLabel(anime.kind) }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <AuthModal 
      v-model="showAuth" 
      @authenticated="handleAuthenticated" 
    />
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAnimeStore } from '../stores/anime'
import {
  Grid3X3,
  Folder,
  Dice5,
  MoreHorizontal,
  Tags,
  Tv,
  Film,
  Disc,
  Globe,
  Star,
  Search,
  User,
  LogIn
} from 'lucide-vue-next'
import { tg, initTelegram } from '../plugins/telegram'
import { authService } from '../services/auth'
import AuthModal from './AuthModal.vue'

const animeStore = useAnimeStore()

const showSearch = ref(false)
const searchInput = ref('')
const searchResults = ref([])
const searchInputRef = ref(null)
const tgUser = ref(null)
const showAuth = ref(false)
const currentUser = ref(null)

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 100)
  }
}

const performSearch = async () => {
  if (searchInput.value.trim()) {
    searchResults.value = await animeStore.searchAnime(searchInput.value)
  }
}

const getImageUrl = (image) => {
  if (!image) return '/placeholder.jpg'
  return image.large || image.medium || '/placeholder.jpg'
}

const getTitle = (anime) => {
  return anime.name || anime.title?.userPreferred || anime.title?.romaji || 'Без названия'
}

const getTypeLabel = (kind) => {
  const types = {
    tv: 'Сериал',
    movie: 'Фильм',
    ova: 'OVA',
    ona: 'ONA',
    special: 'Спешл'
  }
  return types[kind] || kind
}

const handleAuthenticated = (user) => {
  currentUser.value = user
}

watch(searchInput, async (newVal) => {
  if (newVal.trim().length > 2) {
    searchResults.value = await animeStore.searchAnime(newVal)
  } else {
    searchResults.value = []
  }
})

onMounted(async () => {
  const user = initTelegram()
  if (user) {
    tgUser.value = user
  }
  
  const authUser = await authService.checkAuth()
  if (authUser) {
    currentUser.value = authUser
  }
  
  if (tg?.initDataUnsafe?.user && !currentUser.value) {
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
      currentUser.value = result.user
    }
  }
})
</script>

<style scoped>
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  text-decoration: none;
  color: #a0aec0;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background: transparent;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(102, 126, 234, 0.15);
  color: #fff;
}

.icon {
  width: 20px;
  height: 20px;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #a0aec0;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.15);
  color: #fff;
}

.icon-small {
  width: 18px;
  height: 18px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn {
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.user-profile {
  margin-left: 0.5rem;
  position: relative;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.user-avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-icon {
  width: 22px;
  height: 22px;
  color: #fff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #a0aec0;
  white-space: nowrap;
}

.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
  z-index: 2000;
}

.search-modal {
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-icon {
  width: 24px;
  height: 24px;
  color: #a0aec0;
  margin-right: 1rem;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #fff;
  outline: none;
}

.search-input::placeholder {
  color: #4a5568;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.result-image {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.result-info h4 {
  margin: 0 0 0.25rem 0;
  color: #fff;
  font-size: 0.95rem;
}

.result-type {
  font-size: 0.8rem;
  color: #a0aec0;
}

.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.3s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}
</style>