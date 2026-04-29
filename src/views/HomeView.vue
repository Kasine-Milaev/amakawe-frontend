<template>
  <div class="home-view">
    <HeroSlider 
      v-if="animeStore.ongoings.length && !animeStore.initialLoading" 
      :items="animeStore.ongoings" 
      badge="ONGOING" 
    />

    <div class="content-wrapper">
      <section class="anime-section">
        <div class="section-header">
          <h2 class="section-title">
  <Flame class="section-icon" /> Популярные аниме
</h2>
          <router-link to="/popular" class="view-all">
            Смотреть всё <ArrowRight class="arrow-icon" />
          </router-link>
        </div>
        
        <div v-if="animeStore.initialLoading" class="loading-section">
          <div class="spinner"></div>
          <p>Загрузка...</p>
        </div>
        
        <div v-else-if="animeStore.error && animeStore.popular.length === 0" class="empty-section">
          <p><AlertTriangle class="error-icon" /> Не удалось загрузить</p>
          <button @click="retryLoad" class="retry-btn">Попробовать снова</button>
        </div>
        
        <div v-else-if="animeStore.popular.length === 0" class="empty-section">
          <p><FolderX class="empty-icon" /> Популярные аниме не найдены</p>
        </div>
        
        <HeroSlider 
          v-else 
          :items="animeStore.popular.slice(0, 10)" 
          compact 
          :autoPlay="false" 
        />
      </section>
      <section class="anime-section">
        <div class="section-header">
          <h2 class="section-title">
  <Film class="section-icon" /> Популярные фильмы
</h2>
          <router-link to="/type/movie" class="view-all">
            Смотреть всё <ArrowRight class="arrow-icon" />
          </router-link>
        </div>
        
        <div v-if="animeStore.initialLoading" class="loading-section">
          <div class="spinner"></div>
          <p>Загрузка фильмов...</p>
        </div>
        
        <div v-else-if="animeStore.popularMovies.length === 0" class="empty-section">
          <p><FolderX class="empty-icon" /> Фильмы не найдены</p>
        </div>
        
        <HeroSlider 
          v-else 
          :items="animeStore.popularMovies.slice(0, 10)" 
          badge="MOVIE" 
          compact 
          :autoPlay="false" 
        />
      </section>
      <section class="anime-section">
        <div class="section-header">
          <h2 class="section-title">
  <Tv class="section-icon" /> Популярные сериалы
</h2>
          <router-link to="/type/tv" class="view-all">
            Смотреть всё <ArrowRight class="arrow-icon" />
          </router-link>
        </div>
        
        <div v-if="animeStore.initialLoading" class="loading-section">
          <div class="spinner"></div>
          <p>Загрузка сериалов...</p>
        </div>
        
        <div v-else-if="animeStore.popularSeries.length === 0" class="empty-section">
          <p><FolderX class="empty-icon" /> Сериалы не найдены</p>
        </div>
        
        <HeroSlider 
          v-else 
          :items="animeStore.popularSeries.slice(0, 10)" 
          badge="TV" 
          compact 
          :autoPlay="false" 
        />
      </section>
      <section class="genres-section">
        <div class="section-header">
          <h2 class="section-title">
  <Tags class="section-icon" /> Популярные жанры
</h2>
          <router-link to="/genres" class="view-all">
            Смотреть всё <ArrowRight class="arrow-icon" />
          </router-link>
        </div>
        
        <div v-if="animeStore.initialLoading" class="loading-section">
          <div class="spinner"></div>
          <p>Загрузка жанров...</p>
        </div>
        
        <div v-else-if="animeStore.genres.length === 0" class="empty-section">
          <p><FolderX class="empty-icon" /> Жанры не найдены</p>
        </div>
        
        <div v-else class="genres-grid">
          <GenreCard 
            v-for="genre in animeStore.genres.slice(0, 12)" 
            :key="genre.id" 
            :genre="genre" 
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAnimeStore } from '../stores/anime'
import HeroSlider from '../components/HeroSlider.vue'
import GenreCard from '../components/GenreCard.vue'
import { ArrowRight, Flame, Film, Tv, Tags, AlertTriangle, FolderX } from 'lucide-vue-next'

const animeStore = useAnimeStore()

const retryLoad = async () => {
  await animeStore.initialize()
}

onMounted(async () => {
  console.log('HomeView mounted')
  await animeStore.initialize()
  console.log('📦 Store state:', {
    ongoings: animeStore.ongoings.length,
    popular: animeStore.popular.length,
    movies: animeStore.popularMovies.length,
    series: animeStore.popularSeries.length,
    genres: animeStore.genres.length
  })
})
</script>

<style scoped>
.home-view {
  padding-top: 70px;
  background: #0f0f1e;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.anime-section,
.genres-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  margin: 0;
  font-size: clamp(1.2rem, 4vw, 1.75rem);
  font-weight: 700;
  color: #fff;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.view-all:hover {
  color: #764ba2;
  gap: 0.75rem;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.view-all:hover .arrow-icon {
  transform: translateX(4px);
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.loading-section,
.empty-section {
  text-align: center;
  padding: 2.5rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  color: #a0aec0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  font-size: 0.95rem;
}

.retry-btn:hover {
  transform: translateY(-2px);
}
@media (max-width: 768px) {
  .home-view {
    padding-top: 60px;
  }
  
  .content-wrapper {
    padding: 1rem 0.75rem;
  }
  
  .anime-section,
  .genres-section {
    margin-bottom: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .view-all {
    font-size: 0.85rem;
    align-self: flex-end;
  }
  
  .genres-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .loading-section,
  .empty-section {
    padding: 2rem 1rem;
    font-size: 0.95rem;
  }
}
.section-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.error-icon,
.empty-icon {
  width: 32px;
  height: 32px;
  color: #4a5568;
  margin: 0 auto 0.75rem;
  display: block;
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0.75rem 0.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .view-all {
    font-size: 0.8rem;
  }
  
  .genres-grid {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  
  .arrow-icon {
    width: 14px;
    height: 14px;
  }
}
@media (max-width: 667px) and (orientation: landscape) {
  .home-view {
    padding-top: 50px;
  }
  
  .content-wrapper {
    padding: 0.75rem;
  }
  
  .anime-section,
  .genres-section {
    margin-bottom: 1.5rem;
  }
}
</style>