<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <span class="logo-text">Амакаве</span>
      </router-link>
      
      <nav class="nav">
        <router-link to="/catalog" class="nav-item">
          <Grid class="icon" />
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
      </nav>
      
      <div class="header-actions">
        <button class="search-btn">
          <Search class="icon" />
        </button>
        
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="profile-btn">
            <div class="avatar-small" :style="{ backgroundImage: userAvatar ? `url(${userAvatar})` : '' }">
              <User v-if="!userAvatar" class="icon" />
            </div>
            <span class="username">@{{ username }}</span>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/auth" class="btn btn-primary">
            <LogIn class="icon" />
            <span>Войти</span>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Grid, Folder, Dice5, Search, User, LogIn } from 'lucide-vue-next'

const isLoggedIn = computed(() => !!localStorage.getItem('auth_token'))
const username = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user).username : ''
})
const userAvatar = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user).avatar : ''
})
</script>

<style scoped>
.header {
  background: rgba(15, 15, 26, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: #a0aec0;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.router-link-active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #a0aec0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  text-decoration: none;
  color: white;
  transition: all 0.2s;
}

.profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  background-size: cover;
  background-position: center;
}

.username {
  font-size: 0.9rem;
  font-weight: 500;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style>