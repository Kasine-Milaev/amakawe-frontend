<template>
  <div class="static-page">
    <div class="page-content">
      <h1 class="page-title">
        <Info class="title-icon" />
        О сайте
      </h1>
      
      <section class="page-section">
        <h2><Sparkles class="section-icon" /> Что такое Amakawe?</h2>
        <p>Amakawe — это современный каталог аниме с удобным поиском, фильтрами по жанрам и типам, а также персональными рекомендациями. Мы собираем информацию из надёжных источников, чтобы предоставить вам актуальные данные об онгоингах, фильмах, OVA, ONA и специальных выпусках.</p>
      </section>

      <section class="page-section">
        <h2><Zap class="section-icon" /> Возможности</h2>
        <ul>
          <li><Search class="feature-icon" /> Умный поиск по названию на русском, английском и японском</li>
          <li><Tags class="feature-icon" /> Фильтрация по жанрам, типу и статусу</li>
          <li><Dice5 class="feature-icon" /> Случайное аниме для тех, кто не знает что посмотреть</li>
          <li><Heart class="feature-icon" /> Избранное и коллекции для удобного доступа</li>
          <li><Smartphone class="feature-icon" /> Полная адаптация под мобильные устройства</li>
          <li><LogIn class="feature-icon" /> Авторизация через Telegram, Google и VK</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Database class="section-icon" /> Источники данных</h2>
        <p>Информация об аниме предоставляется через официальные API:</p>
        <ul>
          <li><strong>AniList</strong> — основной источник метаданных</li>
          <li><strong>MyAnimeList (Jikan API)</strong> — дополнительная информация</li>
        </ul>
        <p>Мы не храним видеофайлы и не предоставляем прямые ссылки на просмотр. Amakawe — это каталог-агрегатор.</p>
      </section>

      <section class="page-section">
        <h2><Code class="section-icon" /> Разработка</h2>
        <p>Проект разработан с использованием современных технологий:</p>
        <ul>
          <li>Frontend: Vue 3 + Vite + Pinia + Vue Router</li>
          <li>Backend: Node.js + Express + JWT</li>
          <li>Деплой: Vercel (frontend) + Vercel (backend)</li>
          <li>Telegram Mini App интеграция</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Info, Sparkles, Zap, Search, Tags, Dice5, Heart, Smartphone, LogIn, Database, Code } from 'lucide-vue-next'
</script>

<style scoped>
.static-page {
  padding-top: 90px;
  min-height: 100vh;
  background: #0f0f1e;
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.page-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.page-section p {
  margin: 0.5rem 0;
  color: #a0aec0;
  line-height: 1.6;
}

.page-section ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: #a0aec0;
  list-style: none;
}

.page-section li {
  margin: 0.5rem 0;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1.5rem 1rem;
  }
  .page-title {
    font-size: 1.5rem;
  }
  .page-section h2 {
    font-size: 1.1rem;
  }
}
</style>