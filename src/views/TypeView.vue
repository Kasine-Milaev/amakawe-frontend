<template>
  <div class="type-view">
    <div class="type-header">
      <h1 class="type-title">{{ pageTitle }}</h1>
      <p class="type-subtitle">{{ pageDescription }}</p>
    </div>

    <div v-if="loading" class="loading">
      <Loader class="spinner" />
      <p>Загрузка...</p>
    </div>

    <div v-else-if="animeList.length === 0" class="empty">
      <FolderX class="empty-icon" />
      <p>Аниме не найдено</p>
    </div>

    <div v-else class="anime-grid">
      <AnimeCard 
        v-for="anime in animeList" 
        :key="anime.id" 
        :anime="anime" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '../stores/anime'
import AnimeCard from '../components/AnimeCard.vue'
import { Loader, FolderX, Tv, Film, Disc, Globe, Star } from 'lucide-vue-next'

const route = useRoute()
const animeStore = useAnimeStore()
const loading = ref(true)

const typeMap = {
  tv: { title: 'Сериалы', desc: 'Популярные аниме-сериалы', icon: Tv, format: 'TV' },
  movie: { title: 'Фильмы', desc: 'Полнометражные аниме-фильмы', icon: Film, format: 'MOVIE' },
  ova: { title: 'OVA', desc: 'Оригинальные видео-анимации', icon: Disc, format: 'OVA' },
  ona: { title: 'ONA', desc: 'Оригинальные сетевые анимации', icon: Globe, format: 'ONA' },
  special: { title: 'Спешлы', desc: 'Специальные выпуски и бонусы', icon: Star, format: 'SPECIAL' }
}

const type = computed(() => route.params.type?.toLowerCase() || 'tv')
const config = computed(() => typeMap[type.value] || typeMap.tv)

const pageTitle = computed(() => config.value.title)
const pageDescription = computed(() => config.value.desc)

const animeList = computed(() => {
  const format = config.value.format
  if (format === 'TV') return animeStore.popularSeries
  if (format === 'MOVIE') return animeStore.popularMovies
  if (format === 'OVA') return animeStore.popularOVA
  if (format === 'ONA') return animeStore.popularONA
  if (format === 'SPECIAL') return animeStore.popularSpecial
  return []
})

onMounted(async () => {
  loading.value = true
  if (animeList.value.length === 0) {
    await animeStore.initialize()
  }
  loading.value = false
})
</script>

<style scoped>
.type-view {
  padding-top: 90px;
  min-height: 100vh;
  background: #0f0f1e;
}

.type-header {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem 2rem;
  text-align: center;
}

.type-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.type-subtitle {
  margin: 0;
  color: #718096;
  font-size: 1.1rem;
}

.loading,
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  color: #667eea;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #4a5568;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

@media (max-width: 768px) {
  .type-header {
    padding: 1rem 1rem 1.5rem;
  }
  .type-title {
    font-size: 1.5rem;
  }
  .anime-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 0 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .anime-grid {
    grid-template-columns: 1fr;
  }
}
</style>