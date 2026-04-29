<template>
  <div class="all-genres-view">
    <div class="container">
      <h1 class="page-title">🏷️ Все жанры</h1>
      <p class="page-subtitle">Выберите жанр для просмотра аниме</p>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>Загрузка жанров...</p>
      </div>

      <div v-else class="genres-grid">
        <router-link
          v-for="genre in filteredGenres"
          :key="genre.id"
          :to="`/genre/${genre.id}`"
          class="genre-card"
        >
          <div class="genre-image-wrapper">
            <div 
              v-if="genre.backgroundImage" 
              class="genre-background"
              :style="{ backgroundImage: `url(${genre.backgroundImage})` }"
            >
              <div class="genre-overlay"></div>
            </div>
            <div v-else class="genre-placeholder">
              <span class="genre-icon">{{ genre.name.charAt(0) }}</span>
              <div class="genre-overlay"></div>
            </div>
            <div class="genre-content">
              <h3 class="genre-name">{{ genre.name }}</h3>
              <span class="genre-count">{{ genre.anime_count || 'N/A' }} тайтлов</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAnimeStore } from '../stores/anime'

const animeStore = useAnimeStore()
const loading = ref(true)

// Фильтруем запрещённые жанры
const filteredGenres = computed(() => {
  const blocked = ['hentai', 'yuri', 'yaoi']
  return animeStore.genres.filter(g => !blocked.includes(g.id.toLowerCase()))
})

onMounted(async () => {
  if (animeStore.genres.length === 0) {
    await animeStore.fetchGenres()
  }
  
  // Загружаем фоны для жанров (кроме запрещённых)
  const genresToLoad = filteredGenres.value.slice(0, 15) // Первые 15 жанров
  
  for (let i = 0; i < genresToLoad.length; i++) {
    const genre = genresToLoad[i]
    
    // Особые правила для некоторых жанров
    let pageNum = 1
    if (genre.name === 'Fantasy') pageNum = 2 // Фэнтези - 2й постер
    if (genre.name === 'Drama') pageNum = 2   // Драма - 2й постер
    if (genre.name === 'Comedy') pageNum = 3  // Комедия - 3й постер
    
    try {
      const result = await animeStore.getAnimeByGenreWithPage(genre.name, pageNum)
      if (result.length > 0) {
        const randomAnime = result[Math.floor(Math.random() * Math.min(result.length, 3))]
        genre.backgroundImage = randomAnime.image?.large || randomAnime.image?.medium
      }
    } catch (err) {
      console.warn(`⚠️ Could not load background for ${genre.name}:`, err.message)
    }
    
    await new Promise(resolve => setTimeout(resolve, 300)) // Небольшая задержка
  }
  
  loading.value = false
})
</script>

<style scoped>
.all-genres-view {
  padding-top: 100px;
  min-height: 100vh;
  background: #0f0f1e;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 3rem;
}

.loading-section {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.genre-card {
  display: block;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.genre-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.genre-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.genre-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.genre-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.genre-icon {
  font-size: 4rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.15);
}

.genre-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.9) 100%
  );
  opacity: 0.7;
  transition: opacity 0.4s ease;
}

.genre-card:hover .genre-overlay {
  opacity: 0.85;
}

.genre-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  z-index: 1;
}

.genre-name {
  margin: 0 0 0.4rem 0;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.genre-count {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .genres-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .container {
    padding: 0 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .genres-grid {
    grid-template-columns: 1fr;
  }
  
  .genre-name {
    font-size: 1.1rem;
  }
}
</style>