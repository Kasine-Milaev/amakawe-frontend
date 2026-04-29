<template>
  <div class="hero-slider" :class="{ 'compact': compact }">
    <div class="slider-container">
      <TransitionGroup name="slide" tag="div" class="slides-wrapper">
        <div v-for="(item, index) in visibleItems" :key="item.id || index" v-show="currentIndex === index" class="slide">
          <div class="slide-background">
            <img :src="getBackgroundUrl(item)" :alt="getTitle(item)" class="bg-image" />
            <div class="bg-overlay"></div>
          </div>
          <div class="slide-content">
            <div class="slide-info">
              <div class="anime-badge" v-if="badge">{{ badge }}</div>
              <h1 class="anime-title">{{ getTitle(item) }}</h1>
              <p v-if="item.title?.native" class="anime-native">{{ item.title.native }}</p>
              <p class="anime-description">{{ truncateText(item.description || item.synopsis, 180) }}</p>
              <div class="anime-meta">
                <span v-if="item.score" class="meta-item"><Star class="meta-icon" /> {{ item.score.toFixed(1) }}</span>
                <span v-if="item.episodes" class="meta-item"><PlayCircle class="meta-icon" /> {{ item.episodes }} эп.</span>
                <span v-if="item.year" class="meta-item"><Calendar class="meta-icon" /> {{ item.year }}</span>
              </div>
              <div class="slide-actions">
                <router-link :to="`/anime/${item.id}`" class="btn-primary"><Play class="btn-icon" /> Подробнее</router-link>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <button v-if="items.length > 1" class="slider-nav prev" @click="prevSlide"><ChevronLeft /></button>
      <button v-if="items.length > 1" class="slider-nav next" @click="nextSlide"><ChevronRight /></button>

      <div v-if="items.length > 1" class="slider-dots">
        <button v-for="(_, index) in Math.min(items.length, 5)" :key="index" :class="['dot', { active: currentIndex === index }]" @click="goToSlide(index)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Star, PlayCircle, Calendar, Play, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  items: { type: Array, required: true },
  badge: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  autoPlay: { type: Boolean, default: true }
})

const currentIndex = ref(0)
let interval = null

const visibleItems = computed(() => props.items.slice(0, 5))

const getTitle = (item) => item?.name || item?.title?.userPreferred || item?.title?.romaji || 'Без названия'
const getImageUrl = (image) => image?.large || image?.medium || '/placeholder.jpg'
const getBackgroundUrl = (item) => item?.banner || getImageUrl(item?.image || item?.poster)
const truncateText = (text, length) => text && text.length > length ? text.substring(0, length) + '...' : text

const nextSlide = () => { currentIndex.value = (currentIndex.value + 1) % visibleItems.value.length }
const prevSlide = () => { currentIndex.value = currentIndex.value === 0 ? visibleItems.value.length - 1 : currentIndex.value - 1 }
const goToSlide = (index) => { currentIndex.value = index }

onMounted(() => {
  if (props.autoPlay && visibleItems.value.length > 1) {
    interval = setInterval(nextSlide, 6000)
  }
})
onUnmounted(() => { if (interval) clearInterval(interval) })
</script>

<style scoped>
.hero-slider { position: relative; height: 550px; overflow: hidden; }
.hero-slider.compact { height: 400px; }
.slider-container { position: relative; width: 100%; height: 100%; }
.slides-wrapper { position: relative; width: 100%; height: 100%; }
.slide { position: absolute; inset: 0; width: 100%; height: 100%; }
.slide-background { position: absolute; inset: 0; }
.bg-image { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5); }
.bg-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15, 15, 30, 0.98) 0%, rgba(15, 15, 30, 0.7) 50%, rgba(15, 15, 30, 0.3) 100%); }
.slide-content { position: relative; z-index: 1; height: 100%; display: flex; align-items: center; padding: 0 5%; }
.slide-info { max-width: 700px; }
.anime-badge { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0.4rem 1rem; border-radius: 20px; color: #fff; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: 1px; }
.anime-title { margin: 0 0 0.5rem 0; font-size: 2.5rem; font-weight: 800; color: #fff; line-height: 1.1; }
.anime-native { margin: 0 0 1rem 0; font-size: 1.3rem; color: #a0aec0; font-weight: 500; }
.anime-description { margin: 0 0 1.5rem 0; font-size: 1rem; line-height: 1.6; color: #cbd5e0; }
.anime-meta { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
.meta-item { display: flex; align-items: center; gap: 0.4rem; color: #e2e8f0; font-weight: 600; font-size: 0.95rem; }
.meta-icon { width: 18px; height: 18px; color: #667eea; }
.slide-actions { display: flex; gap: 1rem; }
.btn-primary { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: #fff; padding: 0.9rem 1.8rem; border-radius: 12px; font-size: 1rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: all 0.3s ease; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); }
.btn-icon { width: 20px; height: 20px; }
.slider-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 10; }
.slider-nav:hover { background: rgba(102, 126, 234, 0.8); }
.slider-nav.prev { left: 1.5rem; }
.slider-nav.next { right: 1.5rem; }
.slider-dots { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.6rem; z-index: 10; }
.dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: all 0.3s ease; }
.dot.active { background: #667eea; width: 28px; border-radius: 4px; }
.slide-enter-active, .slide-leave-active { transition: all 0.6s ease; }
.slide-enter-from { opacity: 0; transform: translateX(50px); }
.slide-leave-to { opacity: 0; transform: translateX(-50px); }
@media (max-width: 768px) {
  .hero-slider { height: 450px; }
  .hero-slider.compact { height: 350px; }
  .anime-title { font-size: 1.5rem; }
  .anime-native { font-size: 1rem; }
  .anime-description { font-size: 0.9rem; }
  .slide-info { max-width: 100%; padding: 0 1rem; }
  .slider-nav { display: none; }
}
</style>