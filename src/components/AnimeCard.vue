<template>
  <router-link :to="`/anime/${anime.id}`" class="anime-card">
    <div class="card-image-wrapper">
      <img
        :src="getImageUrl(anime.image)"
        :alt="getTitle(anime)"
        class="card-image"
        loading="lazy"
        @error="onImageError"
      />
      <div class="card-overlay">
        <div class="card-rating" v-if="anime.score">
          <Star class="star-icon" />
          <span>{{ anime.score.toFixed(1) }}</span>
        </div>
        <div class="card-type" v-if="anime.kind">
          {{ getTypeLabel(anime.kind) }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ getTitle(anime) }}</h3>
      <p v-if="anime.title?.native && anime.title?.native !== getTitle(anime)" class="card-native">
        {{ anime.title.native }}
      </p>
      <div class="card-meta">
        <span v-if="anime.episodes" class="card-episodes">
          {{ anime.episodes }} эп.
        </span>
        <span v-if="anime.year" class="card-year">
          {{ anime.year }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { Star } from 'lucide-vue-next'

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
})

const getTitle = (anime) => {
  return anime.name || anime.title?.userPreferred || anime.title?.romaji || 'Без названия'
}

const getImageUrl = (image) => {
  return image?.large || image?.medium || '/placeholder.jpg'
}

const onImageError = (e) => {
  e.target.src = '/placeholder.jpg'
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
</script>

<style scoped>
.anime-card {
  display: block;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.anime-card:hover {
  transform: translateY(-8px) rotateX(5deg) rotateY(5deg);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  transform: translateZ(20px);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.anime-card:hover .card-image {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.85rem;
  backdrop-filter: blur(4px);
}

.star-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.card-type {
  background: rgba(102, 126, 234, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 0.75rem;
}

.card-title {
  margin: 0 0 0.25rem 0;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-native {
  margin: 0 0 0.5rem 0;
  color: #718096;
  font-size: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #4a5568;
}
</style>