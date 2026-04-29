<template>
  <div class="static-page">
    <div class="page-content">
      <h1 class="page-title">
        <ScrollText class="title-icon" />
        Правила использования
      </h1>
      
      <section class="page-section">
        <h2><FileText class="section-icon" /> Общие положения</h2>
        <p>Используя сайт Amakawe, вы соглашаетесь соблюдать следующие правила:</p>
      </section>

      <section class="page-section">
        <h2><CircleCheck class="section-icon" /> Разрешено</h2>
        <ul>
          <li><Eye class="rule-icon" /> Просмотр каталога аниме и информации о тайтлах</li>
          <li><Search class="rule-icon" /> Использование поиска и фильтров для навигации</li>
          <li><Bookmark class="rule-icon" /> Создание личных коллекций и добавление в избранное</li>
          <li><LogIn class="rule-icon" /> Авторизация через поддерживаемые сервисы</li>
          <li><Smartphone class="rule-icon" /> Использование Telegram Mini App версии сайта</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><CircleX class="section-icon" /> Запрещено</h2>
        <ul>
          <li><Bot class="rule-icon" /> Автоматизированный сбор данных (скрейпинг) без разрешения</li>
          <li><ShieldAlert class="rule-icon" /> Попытки взлома, обхода защиты или нарушения работы сервиса</li>
          <li><AlertTriangle class="rule-icon" /> Размещение вредоносного контента или спама</li>
          <li><Briefcase class="rule-icon" /> Использование сайта в коммерческих целях без согласия</li>
          <li><Copyright class="rule-icon" /> Нарушение авторских прав при использовании материалов</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Shield class="section-icon" /> Ответственность</h2>
        <p>Администрация не несёт ответственности за:</p>
        <ul>
          <li>Точность и актуальность данных из сторонних источников</li>
          <li>Временные перебои в работе сервиса</li>
          <li>Содержание внешних ресурсов, на которые ведут ссылки</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><RefreshCw class="section-icon" /> Изменения правил</h2>
        <p>Администрация оставляет за собой право изменять данные правила. Актуальная версия всегда доступна на этой странице.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ScrollText, FileText, CircleCheck, Eye, Search, Bookmark, LogIn, Smartphone, CircleX, Bot, ShieldAlert, AlertTriangle, Briefcase, Copyright, Shield, RefreshCw } from 'lucide-vue-next'
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
  padding-left: 0;
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

.rule-icon {
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