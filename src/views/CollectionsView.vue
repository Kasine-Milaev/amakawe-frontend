<template>
  <div class="collections-view">
    <div class="container">
      <h1 class="page-title">📚 Коллекции и подборки</h1>
      <p class="page-subtitle">Лучшие подборки аниме на любой вкус</p>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>Загрузка коллекций...</p>
      </div>

      <div v-else class="collections-grid">
        <div 
          v-for="collection in collections" 
          :key="collection.id" 
          class="collection-card"
          @click="goToCollection(collection)"
        >
          <div class="collection-image-wrapper">
            <div class="collection-background" :style="{ backgroundImage: `url(${collection.image})` }">
              <div class="collection-overlay"></div>
            </div>
            <div class="collection-badge">{{ collection.count }} тайтлов</div>
          </div>
          <div class="collection-info">
            <h3 class="collection-title">{{ collection.title }}</h3>
            <p class="collection-description">{{ collection.description }}</p>
            <div class="collection-tags">
              <span v-for="tag in collection.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const collections = ref([])
const collectionsData = [
  {
    id: 1,
    title: '🔥 Топ-100 аниме всех времён',
    description: 'Лучшие аниме по версии пользователей и критиков. Шедевры, которые должен увидеть каждый.',
    count: 100,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/5114.jpg',
    tags: ['Популярное', 'Классика', 'Топ']
  },
  {
    id: 2,
    title: '🎬 Лучшие аниме-фильмы',
    description: 'Полнометражные аниме, которые заслуживают вашего внимания. От классики до современности.',
    count: 50,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/199.jpg',
    tags: ['Фильмы', 'Полный метр']
  },
  {
    id: 3,
    title: '⚔️ Экшен и приключения',
    description: 'Динамичные аниме с захватывающими битвами и невероятными приключениями.',
    count: 150,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/11061.jpg',
    tags: ['Экшен', 'Приключения', 'Сёнэн']
  },
  {
    id: 4,
    title: '💕 Романтика и драма',
    description: 'Трогательные истории любви и драматичные сюжеты, которые заставят плакать.',
    count: 80,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/23273.jpg',
    tags: ['Романтика', 'Драма']
  },
  {
    id: 5,
    title: '😂 Комедии для поднятия настроения',
    description: 'Смешные аниме, которые поднимут настроение и заставят смеяться до слёз.',
    count: 120,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/30276.jpg',
    tags: ['Комедия', 'Повседневность']
  },
  {
    id: 6,
    title: '👻 Хоррор и мистика',
    description: 'Страшные и загадочные аниме для любителей пощекотать нервы.',
    count: 40,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/19.jpg',
    tags: ['Хоррор', 'Мистика', 'Триллер']
  },
  {
    id: 7,
    title: '🎮 Игры и киберспорт',
    description: 'Аниме про игры, виртуальную реальность и киберспортивные сражения.',
    count: 60,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/22199.jpg',
    tags: ['Игры', 'Фантастика']
  },
  {
    id: 8,
    title: '🎵 Музыка и идолы',
    description: 'Аниме про музыку, концертные выступления и путь к славе.',
    count: 45,
    image: 'https://cdn.anilist.co/img/dir/anime/reg/21659.jpg',
    tags: ['Музыка', 'Идолы']
  }
]

const goToCollection = (collection) => {
  router.push({
    path: '/collections',
    query: { id: collection.id }
  })
}

onMounted(() => {
  setTimeout(() => {
    collections.value = collectionsData
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.collections-view {
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
  margin-bottom: 3rem;
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

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.collection-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover {
  transform: translateY(-8px);
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.collection-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.collection-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;
}

.collection-card:hover .collection-background {
  transform: scale(1.05);
}

.collection-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 15, 30, 0.1) 0%,
    rgba(15, 15, 30, 0.9) 100%
  );
}

.collection-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.collection-info {
  padding: 1.5rem;
}

.collection-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.collection-description {
  margin: 0 0 1rem 0;
  color: #a0aec0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.collection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
}
</style>