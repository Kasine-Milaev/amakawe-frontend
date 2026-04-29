<template>
  <div class="random-view">
    <div class="container">
      <div class="random-header">
        <h1 class="page-title">🎲 Случайное аниме</h1>
        <p class="page-subtitle">Доверьтесь удаче и откройте для себя что-то новое!</p>
      </div>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>Выбираем случайное аниме...</p>
      </div>

      <div v-else-if="randomAnime" class="random-anime-card">
        <router-link :to="`/anime/${randomAnime.id}`" class="anime-link">
          <div class="anime-poster-wrapper">
            <img 
              :src="getImageUrl(randomAnime.image)" 
              :alt="getTitle(randomAnime)"
              class="anime-poster"
            />
            <div class="anime-rating" v-if="randomAnime.score">
              <Star class="star-icon" />
              <span>{{ randomAnime.score.toFixed(1) }}</span>
            </div>
          </div>
          
          <div class="anime-info">
            <h2 class="anime-title">{{ getTitle(randomAnime) }}</h2>
            <p v-if="randomAnime.title?.native" class="anime-native">
              {{ randomAnime.title.native }}
            </p>
            
            <div class="anime-tags">
              <span class="tag" v-if="randomAnime.kind">{{ getTypeLabel(randomAnime.kind) }}</span>
              <span class="tag year" v-if="randomAnime.year">{{ randomAnime.year }}</span>
              <span class="tag episodes" v-if="randomAnime.episodes">
                {{ randomAnime.episodes }} эп.
              </span>
            </div>
            
            <p class="anime-description">{{ truncateDescription(randomAnime.description) }}</p>
            
            <div class="anime-genres" v-if="randomAnime.genres?.length">
              <span v-for="genre in randomAnime.genres.slice(0, 5)" :key="genre" class="genre-tag">
                {{ genre }}
              </span>
            </div>
          </div>
        </router-link>
        
        <div class="random-actions">
          <button @click="getRandomAnime" class="btn-primary" :disabled="loading">
            <Shuffle class="btn-icon" />
            Ещё раз
          </button>
          <router-link :to="`/anime/${randomAnime.id}`" class="btn-secondary">
            <Play class="btn-icon" />
            Подробнее
          </router-link>
        </div>
      </div>

      <div v-else class="error-section">
        <p>😕 Не удалось выбрать случайное аниме</p>
        <button @click="getRandomAnime" class="btn-primary">
          Попробовать снова
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAnimeStore } from '../stores/anime'
import { Star, Shuffle, Play } from 'lucide-vue-next'

const animeStore = useAnimeStore()
const randomAnime = ref(null)
const loading = ref(false)

const getTitle = (anime) => {
  return anime.name || anime.title?.userPreferred || anime.title?.romaji || 'Без названия'
}

const getImageUrl = (image) => {
  return image?.large || image?.medium || '/placeholder.jpg'
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

const truncateDescription = (desc) => {
  if (!desc) return 'Описание отсутствует'
  const cleanDesc = desc.replace(/<[^>]*>/g, '')
  return cleanDesc.length > 300 ? cleanDesc.substring(0, 300) + '...' : cleanDesc
}

const getRandomAnime = async () => {
  loading.value = true
  try {
    randomAnime.value = await animeStore.getRandomAnime()
  } catch (err) {
    console.error('❌ Random anime error:', err)
    randomAnime.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getRandomAnime()
})
</script>

<style scoped>
.random-view {
  padding-top: 100px;
  min-height: 100vh;
  background: #0f0f1e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

.random-header {
  text-align: center;
  margin-bottom: 3rem;
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
}

.loading-section,
.error-section {
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.random-anime-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.anime-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.anime-poster-wrapper {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.anime-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.anime-rating {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.85);
  color: #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  backdrop-filter: blur(4px);
}

.star-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.anime-info {
  padding: 2rem;
}

.anime-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.anime-native {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  color: #a0aec0;
}

.anime-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.tag.year {
  background: rgba(118, 75, 162, 0.2);
  color: #764ba2;
}

.tag.episodes {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
}

.anime-description {
  margin: 0 0 1.5rem 0;
  color: #cbd5e0;
  line-height: 1.7;
  font-size: 1rem;
}

.anime-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background: rgba(255, 255, 255, 0.05);
  color: #a0aec0;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.random-actions {
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .anime-poster-wrapper {
    height: 300px;
  }
  
  .anime-title {
    font-size: 1.5rem;
  }
  
  .random-actions {
    flex-direction: column;
  }
}
</style>