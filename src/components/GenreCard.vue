<template>
  <router-link :to="`/genre/${genre.id}`" class="genre-card">
    <div class="genre-image-wrapper">
      <!-- Фон из первого тайтла -->
      <div 
        v-if="genre.backgroundImage" 
        class="genre-background"
        :style="{ backgroundImage: `url(${genre.backgroundImage})` }"
      >
        <div class="genre-overlay"></div>
      </div>
      
      <!-- Заглушка если нет фона -->
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
</template>

<script setup>
const props = defineProps({
  genre: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
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
</style>