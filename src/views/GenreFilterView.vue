<template>
  <div class="genre-filter-view">
    <div class="container">
      <h1 class="page-title">
        <span v-if="isTypeView">📺 Тип: {{ typeDisplayName }}</span>
        <span v-else-if="isAllGenres">🏷️ Все жанры</span>
        <span v-else>🏷️ Жанр: {{ genreDisplayName }}</span>
      </h1>
      
      <div v-if="loading && animeList.length === 0" class="loading-initial">
        <div class="spinner"></div>
        <p>Загрузка тайтлов...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-state">
        <p>😕 {{ errorMessage }}</p>
        <button @click="retryLoad" class="retry-btn">Попробовать снова</button>
      </div>
      
      <div v-else-if="animeList.length === 0 && !loading" class="empty-state">
        <p>😕 Ничего не найдено</p>
        <p class="debug-info">Всего: {{ totalItems }}</p>
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
          <p>Загрузка ещё тайтлов... ({{ animeList.length }} / {{ totalItems }})</p>
        </div>
        
        <div v-else-if="animeList.length > 0" class="end-message">
          <p>✨ Все тайтлы загружены ({{ animeList.length }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '../stores/anime'
import AnimeCard from '../components/AnimeCard.vue'

const route = useRoute()
const animeStore = useAnimeStore()
const animeList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const errorMessage = ref(null)
const loadMoreTrigger = ref(null)
const totalItems = ref(0)

const props = defineProps({
  type: {
    type: String,
    default: null
  },
  genreType: {
    type: String,
    default: null
  }
})

const isTypeView = computed(() => {
  return route.path.startsWith('/type/')
})

const isAllGenres = computed(() => {
  return route.name === 'genres' || props.genreType === 'all'
})

const typeDisplayName = computed(() => {
  const types = {
    tv: 'Сериалы',
    movie: 'Фильмы',
    ova: 'OVA',
    ona: 'ONA',
    special: 'Спешлы'
  }
  return types[route.params.type] || route.params.type
})

const genreDisplayName = computed(() => {
  if (isAllGenres.value) return 'все'
  const genre = animeStore.genres.find(g => g.id === route.params.genre)
  return genre?.name || route.params.genre?.replace(/-/g, ' ')
})

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  errorMessage.value = null
  
  try {
    let result = null
    
    if (isTypeView.value) {
      const typeMap = {
        tv: 'TV',
        movie: 'MOVIE',
        ova: 'OVA',
        ona: 'ONA',
        special: 'SPECIAL'
      }
      const format = typeMap[route.params.type] || route.params.type.toUpperCase()
      
      result = await animeStore.getAnimeByTypeWithPage(format, currentPage.value)
      animeList.value = [...animeList.value, ...result.anime]
      totalItems.value = result.total
      hasMore.value = result.hasNextPage
    } else if (isAllGenres.value) {
      result = await animeStore.getPopularWithPage(currentPage.value)
      animeList.value = [...animeList.value, ...result.anime]
      totalItems.value = result.total
      hasMore.value = result.hasNextPage
    } else {
      const genre = animeStore.genres.find(g => g.id === route.params.genre)
      if (!genre) {
        errorMessage.value = `Жанр "${route.params.genre}" не найден`
        hasMore.value = false
        return
      }
      
      const newAnime = await animeStore.getAnimeByGenreWithPage(genre.name, currentPage.value)
      animeList.value = [...animeList.value, ...newAnime]
      hasMore.value = newAnime.length >= 50
    }
    
    console.log('📊 Loaded:', animeList.value.length, 'Total:', totalItems.value, 'Has more:', hasMore.value)
    
    if (hasMore.value) {
      currentPage.value++
    }
  } catch (err) {
    console.error('❌ Load error:', err)
    errorMessage.value = 'Ошибка при загрузке: ' + err.message
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  animeList.value = []
  currentPage.value = 1
  hasMore.value = true
  totalItems.value = 0
  errorMessage.value = null
  loadMore()
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
  console.log('🎬 GenreFilterView mounted:', route.path)
  currentPage.value = 1
  animeList.value = []
  hasMore.value = true
  totalItems.value = 0
  errorMessage.value = null
  
  loadMore().then(() => {
    setTimeout(setupInfiniteScroll, 500)
  })
})

watch(() => route.fullPath, () => {
  console.log('🔄 Route changed:', route.fullPath)
  currentPage.value = 1
  animeList.value = []
  hasMore.value = true
  totalItems.value = 0
  errorMessage.value = null
  
  loadMore().then(() => {
    setTimeout(setupInfiniteScroll, 500)
  })
})
</script>

<style scoped>
.genre-filter-view {
  padding-top: 100px;
  min-height: 100vh;
  padding-bottom: 3rem;
  background: #0f0f1e;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  color: #fff;
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-initial {
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

.error-state,
.empty-state {
  text-align: center;
  padding: 4rem;
  color: #718096;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.debug-info {
  font-size: 0.9rem;
  color: #4a5568;
  margin-top: 0.5rem;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
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
    font-size: 1.5rem;
  }
  
  .anime-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}
</style>