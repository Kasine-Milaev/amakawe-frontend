<template>
  <div class="anime-details-view">
    <div v-if="animeStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>

    <div v-else-if="anime" class="details-container">
      <!-- Background -->
      <div class="details-background">
        <img :src="getBackgroundUrl(anime)" :alt="getTitle(anime)" class="bg-image" />
        <div class="bg-overlay"></div>
      </div>

      <div class="details-content">
        <!-- Poster Section -->
        <div class="poster-section">
          <div class="poster-wrapper">
            <img :src="getImageUrl(anime.image)" :alt="getTitle(anime)" class="poster" />
            <div class="poster-badge" :class="anime.status">{{ getStatusLabel(anime.status) }}</div>
          </div>
          
          <button class="watch-btn">
            <Play class="btn-icon" /> Смотреть онлайн
          </button>

          <div class="poster-actions">
            <button class="action-btn primary"><Heart class="icon" /> В список</button>
            <button class="action-btn"><Share2 class="icon" /></button>
          </div>

          <div class="rating-block">
            <div class="rating-score">
              <span class="score">{{ anime.score?.toFixed(1) || 'N/A' }}</span>
              <span class="score-label">Рейтинг</span>
            </div>
            <div class="rating-stars">
              <Star v-for="i in 10" :key="i" :class="['star', { filled: i <= Math.round((anime.score || 0) * 2) }]" />
            </div>
            <span class="rating-votes">из 10</span>
          </div>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h1 class="anime-title">{{ getTitle(anime) }}</h1>
          <h2 v-if="anime.title?.native" class="anime-native">{{ anime.title.native }}</h2>

          <div class="anime-tags">
            <span class="tag" v-if="anime.kind">{{ getTypeLabel(anime.kind) }}</span>
            <span class="tag year" v-if="anime.year">{{ anime.year }}</span>
            <span class="tag status" :class="anime.status" v-if="anime.status">{{ getStatusLabel(anime.status) }}</span>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Количество серий:</span>
              <span class="info-value">{{ anime.episodes || 'N/A' }} {{ anime.episodes_total ? `из ${anime.episodes_total}` : '' }}</span>
            </div>
            <div class="info-item" v-if="anime.duration">
              <span class="info-label">Длительность:</span>
              <span class="info-value">{{ anime.duration }} мин.</span>
            </div>
            <div class="info-item" v-if="anime.genres?.length">
              <span class="info-label">Жанры:</span>
              <span class="info-value genres">
                <router-link v-for="genre in anime.genres" :key="genre" :to="`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`" class="genre-link">{{ genre }}</router-link>
              </span>
            </div>
            <div class="info-item" v-if="anime.studios?.length">
              <span class="info-label">Студия:</span>
              <span class="info-value">{{ anime.studios.map(s => s.name).join(', ') }}</span>
            </div>
          </div>

          <div class="description-block">
            <h3>Описание</h3>
            <div class="description" v-html="formatDescription(anime.description)"></div>
          </div>

          <!-- Relations Section - ИСПРАВЛЕНО -->
          <div class="relations-section" v-if="relations && relations.length > 0">
            <div class="relations-header">
              <h3>🔗 Похожее и связанное</h3>
              <div class="relations-nav">
                <button class="rel-nav-btn" @click="scrollRelations(-300)" :disabled="canScrollLeft === false">
                  <ChevronLeft />
                </button>
                <button class="rel-nav-btn" @click="scrollRelations(300)" :disabled="canScrollRight === false">
                  <ChevronRight />
                </button>
              </div>
            </div>
            
            <div class="relations-wrapper" ref="relationsContainer">
              <div class="relations-grid">
                <router-link
                  v-for="relation in relations"
                  :key="relation.id"
                  :to="relation.id ? `/anime/${relation.id}` : '#'"
                  class="relation-card"
                  :class="{ disabled: !relation.id }"
                  @click.native.prevent="handleRelationClick($event, relation)"
                >
                  <div class="relation-image-wrapper">
                    <img :src="relation.coverImage || '/placeholder.jpg'" :alt="relation.title" class="relation-image" loading="lazy" @error="onImageError" />
                    <div class="relation-type-badge" :class="getRelationTypeClass(relation.type)">{{ getRelationTypeLabel(relation.type) }}</div>
                  </div>
                  <div class="relation-info">
                    <span class="relation-format">{{ getFormatLabel(relation.format) }}</span>
                    <h4 class="relation-title">{{ relation.title }}</h4>
                    <div class="relation-meta" v-if="relation.year || relation.score">
                      <span v-if="relation.year" class="relation-year">{{ relation.year }}</span>
                      <span v-if="relation.score" class="relation-score"><Star class="star-small" /> {{ relation.score.toFixed(1) }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimeStore } from '../stores/anime'
import { Play, Heart, Share2, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const animeStore = useAnimeStore()
const anime = ref(null)
const relations = ref([])
const relationsContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

onMounted(async () => {
  try {
    anime.value = await animeStore.fetchAnimeById(route.params.id)
    console.log('✅ Anime loaded:', anime.value)
    
    // Загружаем связи
    if (anime.value.relations && anime.value.relations.length > 0) {
      relations.value = anime.value.relations.map(rel => {
        const node = rel.node
        return {
          id: node?.id || null,
          title: node?.title?.userPreferred || node?.title?.romaji || node?.title?.english || 'Без названия',
          coverImage: node?.coverImage?.medium || node?.coverImage?.large || '/placeholder.jpg',
          type: rel.relationType || 'OTHER',
          format: node?.format,
          year: node?.seasonYear,
          score: node?.averageScore ? node.averageScore / 10 : null
        }
      }).filter(r => r.id) // Фильтруем только с валидным ID
      console.log('✅ Relations loaded:', relations.value.length)
    }
  } catch (error) {
    console.error('❌ Failed to load anime:', error)
  }
})

const handleRelationClick = (event, relation) => {
  if (relation.id) {
    router.push(`/anime/${relation.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    event.preventDefault()
  }
}

const scrollRelations = (distance) => {
  if (relationsContainer.value) {
    relationsContainer.value.scrollBy({ left: distance, behavior: 'smooth' })
    updateScrollButtons()
  }
}

const updateScrollButtons = () => {
  if (relationsContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = relationsContainer.value
    canScrollLeft.value = scrollLeft > 0
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
  }
}

const getTitle = (animeData) => animeData?.name || animeData?.title?.userPreferred || animeData?.title?.romaji || 'Без названия'
const getImageUrl = (image) => image?.large || image?.medium || '/placeholder.jpg'
const getBackgroundUrl = (animeData) => animeData?.banner || getImageUrl(animeData?.image)

const getTypeLabel = (kind) => ({ tv: 'Сериал', tv_short: 'Сериал', movie: 'Фильм', ova: 'OVA', ona: 'ONA', special: 'Спешл', music: 'Музыка' }[kind] || kind)
const getFormatLabel = (format) => getTypeLabel(format)
const getStatusLabel = (status) => ({ ongoing: 'Онгоинг', completed: 'Завершено', announced: 'Анонс', cancelled: 'Отменено', hiatus: 'Пауза' }[status] || status)

const getRelationTypeLabel = (type) => ({
  SEQUEL: 'Сиквел', PREQUEL: 'Приквел', SIDE_STORY: 'Сайд-стори',
  ALTERNATIVE: 'Альтернатива', ALTERNATIVE_SETTING: 'Альт. обстановка',
  SPIN_OFF: 'Спин-офф', OTHER: 'Другое', PARENT: 'Родитель', CHARACTER: 'Персонаж',
  SUMMARY: 'Обзор', FULL_STORY: 'Полная история'
}[type] || 'Другое')

const getRelationTypeClass = (type) => type?.toLowerCase().replace(/_/g, '-') || 'other'
const formatDescription = (desc) => desc ? desc.replace(/<br>/g, '<br/>').replace(/\n/g, '<br/>') : 'Описание отсутствует'
const onImageError = (e) => { e.target.src = '/placeholder.jpg'; e.target.onerror = null }
</script>

<style scoped>
.anime-details-view { min-height: 100vh; padding-top: 70px; background: #0f0f1e; }
.loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; color: #fff; }
.spinner { width: 50px; height: 50px; border: 3px solid rgba(102, 126, 234, 0.3); border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

.details-container { position: relative; }
.details-background { position: absolute; top: 0; left: 0; right: 0; height: 600px; overflow: hidden; }
.bg-image { width: 100%; height: 100%; object-fit: cover; filter: blur(80px) brightness(0.4); transform: scale(1.1); }
.bg-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 15, 30, 0.85) 0%, rgba(15, 15, 30, 1) 100%); }

.details-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 320px 1fr; gap: 3rem; }

.poster-section { position: sticky; top: 90px; height: fit-content; }
.poster-wrapper { position: relative; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4); }
.poster { width: 100%; display: block; }
.poster-badge { position: absolute; top: 1rem; right: 1rem; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #fff; }
.poster-badge.ongoing { background: #48bb78; }
.poster-badge.completed { background: #667eea; }

.watch-btn { width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: #fff; padding: 1rem; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 10px; margin-bottom: 1rem; transition: all 0.3s ease; }
.watch-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); }
.btn-icon { width: 20px; height: 20px; }

.poster-actions { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.action-btn { flex: 1; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; padding: 0.75rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; transition: all 0.3s ease; }
.action-btn.primary { background: rgba(102, 126, 234, 0.2); border-color: #667eea; }
.action-btn:hover { background: rgba(102, 126, 234, 0.3); border-color: #667eea; }
.icon { width: 18px; height: 18px; }

.rating-block { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; text-align: center; }
.rating-score { margin-bottom: 1rem; }
.score { display: block; font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.score-label { font-size: 0.9rem; color: #a0aec0; }
.rating-stars { display: flex; justify-content: center; gap: 0.25rem; margin-bottom: 0.5rem; }
.star { width: 18px; height: 18px; color: rgba(255, 255, 255, 0.2); }
.star.filled { color: #ffd700; fill: currentColor; }
.rating-votes { font-size: 0.85rem; color: #718096; }

.info-section { color: #fff; }
.anime-title { margin: 0 0 0.5rem 0; font-size: 2.5rem; font-weight: 800; }
.anime-native { margin: 0 0 1.5rem 0; font-size: 1.5rem; color: #a0aec0; font-weight: 500; }
.anime-tags { display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }
.tag { background: rgba(102, 126, 234, 0.2); color: #667eea; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
.tag.year { background: rgba(118, 75, 162, 0.2); color: #764ba2; }
.tag.status { background: rgba(72, 187, 120, 0.2); color: #48bb78; }

.info-grid { display: grid; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); }
.info-item { display: grid; grid-template-columns: 180px 1fr; gap: 1rem; }
.info-label { color: #718096; font-weight: 500; }
.info-value { color: #e2e8f0; }
.info-value.genres { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.genre-link { color: #667eea; text-decoration: none; background: rgba(102, 126, 234, 0.15); padding: 0.2rem 0.6rem; border-radius: 4px; transition: all 0.2s; }
.genre-link:hover { background: rgba(102, 126, 234, 0.3); text-decoration: underline; }

.description-block { margin-bottom: 2rem; }
.description-block h3 { margin: 0 0 1rem 0; font-size: 1.5rem; }
.description { line-height: 1.8; color: #cbd5e0; }

/* RELATIONS SECTION */
.relations-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.relations-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.relations-header h3 { margin: 0; font-size: 1.5rem; color: #fff; }

.relations-nav { display: flex; gap: 0.5rem; }
.rel-nav-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.rel-nav-btn:hover:not(:disabled) { background: rgba(102, 126, 234, 0.3); border-color: #667eea; }
.rel-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.relations-wrapper { overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 0.5rem; }
.relations-wrapper::-webkit-scrollbar { display: none; }

.relations-grid { display: flex; gap: 1rem; min-width: max-content; padding: 0.5rem 0; }

.relation-card { display: flex; gap: 1rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; overflow: hidden; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; min-width: 220px; max-width: 220px; }
.relation-card:hover:not(.disabled) { transform: translateY(-5px) scale(1.02); background: rgba(255, 255, 255, 0.05); border-color: rgba(102, 126, 234, 0.4); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
.relation-card.disabled { opacity: 0.6; cursor: not-allowed; }

.relation-image-wrapper { position: relative; flex-shrink: 0; }
.relation-image { width: 70px; height: 100px; object-fit: cover; }
.relation-type-badge { position: absolute; top: 4px; left: 4px; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #fff; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px); }
.relation-type-badge.sequel { background: #48bb78; }
.relation-type-badge.prequel { background: #667eea; }
.relation-type-badge.side-story { background: #ed8936; }
.relation-type-badge.alternative { background: #e53e3e; }
.relation-type-badge.spin-off { background: #9f7aea; }

.relation-info { flex: 1; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; min-width: 0; }
.relation-format { font-size: 0.75rem; color: #667eea; font-weight: 600; text-transform: uppercase; }
.relation-title { margin: 0; font-size: 0.9rem; font-weight: 600; color: #fff; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.relation-meta { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #718096; }
.relation-score { display: flex; align-items: center; gap: 0.25rem; color: #ffd700; font-weight: 600; }
.star-small { width: 12px; height: 12px; fill: currentColor; }

/* Mobile */
@media (max-width: 968px) {
  .details-content { grid-template-columns: 1fr; gap: 2rem; }
  .poster-section { position: relative; top: 0; max-width: 250px; margin: 0 auto; }
  .anime-title { font-size: 1.5rem; text-align: center; }
  .anime-native { font-size: 1.1rem; text-align: center; }
  .anime-tags { justify-content: center; }
  .info-item { grid-template-columns: 1fr; gap: 0.25rem; }
  .info-label { color: #a0aec0; font-size: 0.9rem; }
}
@media (max-width: 640px) {
  .poster-section { max-width: 200px; }
  .poster-wrapper { border-radius: 8px; }
  .watch-btn, .action-btn { padding: 0.75rem; font-size: 0.9rem; }
  .rating-block { padding: 1rem; }
  .score { font-size: 2.5rem; }
  .info-grid { padding: 1rem; }
  .description { font-size: 0.95rem; }
  .relations-grid { gap: 0.75rem; }
  .relation-card { min-width: 180px; max-width: 180px; }
  .relation-image { width: 60px; height: 85px; }
}
@media (max-width: 480px) {
  .details-content { padding: 1rem; }
  .poster-section { max-width: 100%; }
  .poster-wrapper { max-width: 180px; margin: 0 auto; }
  .poster-actions { flex-direction: column; }
  .anime-title { font-size: 1.3rem; }
  .anime-tags { flex-wrap: wrap; }
  .tag { font-size: 0.8rem; padding: 0.3rem 0.8rem; }
  .relations-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>