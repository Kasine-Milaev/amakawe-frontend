<template>
  <div class="static-page">
    <div class="page-content">
      <h1 class="page-title">
        <Mail class="title-icon" />
        Контакты
      </h1>
      
      <section class="page-section">
        <h2><MessageCircle class="section-icon" /> Связаться с нами</h2>
        <p>Есть вопросы, предложения или нашли ошибку? Напишите нам:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@amakawe.ru">support@amakawe.ru</a></li>
          <li><strong>Telegram:</strong> <a href="https://t.me/amakawe_support" target="_blank">@amakawe_support</a></li>
          <li><strong>Bot:</strong> <a href="https://t.me/amakawe_anime_bot" target="_blank">@amakawe_anime_bot</a></li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Bug class="section-icon" /> Сообщить об ошибке</h2>
        <p>Если вы обнаружили баг или неточность в данных:</p>
        <ol>
          <li>Опишите проблему максимально подробно</li>
          <li>Укажите ссылку на страницу или название аниме</li>
          <li>Приложите скриншот если возможно</li>
          <li>Отправьте через форму выше или в Telegram</li>
        </ol>
      </section>

      <section class="page-section">
        <h2><Lightbulb class="section-icon" /> Предложить идею</h2>
        <p>Хотите видеть новую функцию на сайте?</p>
        <p>Напишите нам с пометкой <strong>"Feature Request"</strong> и мы обязательно рассмотрим ваше предложение!</p>
      </section>

      <section class="page-section">
        <h2><Handshake class="section-icon" /> Сотрудничество</h2>
        <p>По вопросам партнёрства и рекламы:</p>
        <p><strong>Email:</strong> <a href="mailto:business@amakawe.ru">business@amakawe.ru</a></p>
      </section>

      <section class="page-section">
        <h2><Clock class="section-icon" /> Время ответа</h2>
        <p>Мы стараемся отвечать на все сообщения в течение <strong>24 часов</strong> в рабочие дни.</p>
        <p>В выходные и праздники время ответа может быть увеличено.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Mail, MessageCircle, Bug, Lightbulb, Handshake, Clock } from 'lucide-vue-next'
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

.page-section ul,
.page-section ol {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: #a0aec0;
}

.page-section li {
  margin: 0.3rem 0;
  line-height: 1.5;
}

.page-section a {
  color: #667eea;
  text-decoration: none;
}

.page-section a:hover {
  text-decoration: underline;
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