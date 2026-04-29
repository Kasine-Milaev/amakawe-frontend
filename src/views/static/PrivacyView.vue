<template>
  <div class="static-page">
    <div class="page-content">
      <h1 class="page-title">
        <ShieldCheck class="title-icon" />
        Политика конфиденциальности
      </h1>
      
      <section class="page-section">
        <h2><Lock class="section-icon" /> Какие данные мы собираем</h2>
        <p>При использовании Amakawe могут собираться следующие данные:</p>
        <ul>
          <li><User class="data-icon" /> <strong>Данные авторизации:</strong> ID, имя, username, аватар из подключённого аккаунта (Telegram/Google/VK)</li>
          <li><Heart class="data-icon" /> <strong>Действия пользователя:</strong> добавленные в избранное аниме, созданные коллекции</li>
          <li><Server class="data-icon" /> <strong>Технические данные:</strong> IP-адрес, тип устройства, браузер (для аналитики и безопасности)</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Target class="section-icon" /> Как мы используем данные</h2>
        <ul>
          <li><Star class="use-icon" /> Для предоставления персонализированного опыта (избранное, рекомендации)</li>
          <li><LogIn class="use-icon" /> Для авторизации и управления аккаунтом</li>
          <li><Wrench class="use-icon" /> Для улучшения работы сервиса и устранения ошибок</li>
          <li><Shield class="use-icon" /> Для защиты от злоупотреблений и обеспечения безопасности</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Key class="section-icon" /> Защита данных</h2>
        <p>Мы принимаем меры для защиты вашей информации:</p>
        <ul>
          <li><KeyRound class="protect-icon" /> Использование JWT-токенов для безопасной аутентификации</li>
          <li><Lock class="protect-icon" /> Хранение данных в зашифрованном виде</li>
          <li><RefreshCw class="protect-icon" /> Регулярное обновление систем безопасности</li>
          <li><EyeOff class="protect-icon" /> Ограничение доступа к персональным данным</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Globe class="section-icon" /> Передача данных третьим лицам</h2>
        <p>Мы не продаём и не передаем ваши персональные данные третьим лицам, за исключением:</p>
        <ul>
          <li>Сервисов авторизации (Telegram, Google, VK) — только в рамках OAuth-процесса</li>
          <li>Хостинг-провайдеров (Vercel) — для обеспечения работы сервиса</li>
          <li>Государственных органов — только по законному требованию</li>
        </ul>
      </section>

      <section class="page-section">
        <h2><Trash2 class="section-icon" /> Удаление данных</h2>
        <p>Вы можете запросить удаление своих данных, обратившись через раздел <router-link to="/contacts">Контакты</router-link>. Мы удалим всю информацию, связанную с вашим аккаунтом, в течение 30 дней.</p>
      </section>

      <section class="page-section">
        <h2><Mail class="section-icon" /> Контакты по вопросам приватности</h2>
        <p>По всем вопросам, связанным с обработкой персональных данных, пишите: <strong>privacy@amakawe.ru</strong></p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ShieldCheck, Lock, User, Heart, Server, Target, Star, LogIn, Wrench, Shield, Key, KeyRound, RefreshCw, EyeOff, Globe, Trash2, Mail } from 'lucide-vue-next'
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

.data-icon,
.use-icon,
.protect-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 0.25rem;
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