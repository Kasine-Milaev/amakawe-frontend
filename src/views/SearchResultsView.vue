<template>
  <div class="search-results-view">
    <div class="container">
      <div class="search-header">
        <h1 class="page-title">🔍 Поиск</h1>
        <div class="search-input-wrapper">
          <Search class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Введите название аниме..."
            class="search-input"
            @keyup.enter="performSearch"
            ref="inputRef"
            autofocus
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            ✕
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>Поиск...</p>
      </div>

      <div v-else-if="!hasSearched" class="empty-state">
        <p>📝 Введите название для поиска</p>
        <p class="hint">Например: Наруто, Стальной алхимик, Атака титанов</p>
      </div>

      <div v-else-if="results.length === 0" class="no-results">
        <p>😕 Ничего не найдено по запросу "{{ searchQuery }}"</p>
        <p class="hint">Попробуйте другой запрос или проверьте правильность написания</p>
      </div>

      <div v-else class="results-section">
        <div class="results-header">
          <p class="results-count">Найдено: {{ results.length }}</p>
        </div>
        
        <div class="results-grid">
          <AnimeCard 
            v-for="anime in results" 
            :key="anime.id" 
            :anime="anime" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimeStore } from '../stores/anime'
import AnimeCard from '../components/AnimeCard.vue'
import { Search } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const animeStore = useAnimeStore()

const searchQuery = ref(route.query.q || '')
const results = ref([])
const loading = ref(false)
const hasSearched = ref(!!route.query.q)
const inputRef = ref(null)

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  hasSearched.value = true
  loading.value = true
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  })
  
  try {
    results.value = await animeStore.searchAnime(searchQuery.value)
    console.log('✅ Search results:', results.value.length)
  } catch (err) {
    console.error('❌ Search error:', err)
    results.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  hasSearched.value = false
  router.push({ path: '/search' })
  inputRef.value?.focus()
}

onMounted(() => {
  if (route.query.q) {
    performSearch()
  }
  inputRef.value?.focus()
})
</script>

<style scoped>
.search-results-view {
  padding-top: 100px;
  min-height: 100vh;
  background: #0f0f1e;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.search-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 700px;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: #718096;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.2rem 3.5rem 1.2rem 3.5rem;
  font-size: 1.1rem;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #4a5568;
}

.clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.2);
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

.empty-state,
.no-results {
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  color: #718096;
}

.empty-state p,
.no-results p {
  margin: 0.5rem 0;
}

.hint {
  font-size: 0.95rem;
  color: #4a5568;
}

.results-section {
  margin-top: 2rem;
}

.results-header {
  margin-bottom: 2rem;
}

.results-count {
  color: #a0aec0;
  font-size: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .search-input {
    padding: 1rem 3rem;
    font-size: 1rem;
  }
  
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>