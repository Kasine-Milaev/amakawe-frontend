<template>
  <div class="popular-view">
    <div class="container">
      <h1 class="page-title">🔥 Популярные аниме</h1>
      <p class="page-subtitle">Самые популярные аниме всех времён</p>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>Загрузка популярных аниме...</p>
      </div>

      <div v-else>
        <div class="anime-grid">
          <AnimeCard 
            v-for="anime in animeList" 
            :key="anime.id" 
            :anime="anime" 
          />
        </div>
        
        <div v-if="hasMore" ref="loadMoreTrigger" class="infinite-loader">
          <div class="loader-spinner"></div>
          <p>Загрузка ещё... ({{ animeList.length }} / {{ totalItems }})</p>
        </div>
        
        <div v-else-if="animeList.length > 0" class="end-message">
          <p>✨ Все тайтлы загружены ({{ animeList.length }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAnimeStore } from '../stores/anime'
import AnimeCard from '../components/AnimeCard.vue'

const animeStore = useAnimeStore()
const animeList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const loadMoreTrigger = ref(null)
const totalItems = ref(0)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const result = await animeStore.getPopularWithPage(currentPage.value)
    animeList.value = [...animeList.value, ...result.anime]
    totalItems.value = result.total
    hasMore.value = result.hasNextPage
    
    if (hasMore.value) {
      currentPage.value++
    }
    
    console.log('📊 Popular loaded:', animeList.value.length, 'Has more:', hasMore.value)
  } catch (err) {
    console.error('❌ Popular load error:', err)
  } finally {
    loading.value = false
  }
}

const setupInfiniteScroll = () => {
  if (!loadMoreTrigger.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        loadMore()
      }
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )
  
  observer.observe(loadMoreTrigger.value)
}

onMounted(() => {
  currentPage.value = 1
  animeList.value = []
  hasMore.value = true
  
  loadMore().then(() => {
    setTimeout(setupInfiniteScroll, 500)
  })
})
</script>

<style scoped>
.popular-view {
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
  margin-bottom: 2rem;
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

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.infinite-loader {
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.end-message {
  text-align: center;
  padding: 2rem;
  color: #48bb78;
  font-weight: 600;
  background: rgba(72, 187, 120, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .anime-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .container {
    padding: 0 1rem 2rem;
  }
}
</style>