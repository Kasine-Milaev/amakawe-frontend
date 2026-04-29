<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-logo">Amakawe</h3>
          <p class="footer-description">
            Ваш надёжный источник аниме и японских сериалов. 
            Смотрите онлайн в высоком качестве.
          </p>
          <div class="footer-social">
            <a href="https://t.me/amakawe_anime_bot" target="_blank" class="social-link" title="Telegram">
              <Send class="icon" />
            </a>
            <a href="https://vk.com" target="_blank" class="social-link" title="VK">
              <Share2 class="icon" />
            </a>
            <a href="#" class="social-link" title="Discord">
              <MessageCircle class="icon" />
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Навигация</h4>
          <ul class="footer-links">
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/popular">Популярное</router-link></li>
            <li><router-link to="/genres">Жанры</router-link></li>
            <li><router-link to="/random">Случайное</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Категории</h4>
          <ul class="footer-links">
            <li><router-link to="/type/tv">Сериалы</router-link></li>
            <li><router-link to="/type/movie">Фильмы</router-link></li>
            <li><router-link to="/type/ova">OVA</router-link></li>
            <li><router-link to="/type/ona">ONA</router-link></li>
            <li><router-link to="/type/special">Спешлы</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Информация</h4>
          <ul class="footer-links">
            <li><router-link to="/about">О сайте</router-link></li>
            <li><router-link to="/rules">Правила</router-link></li>
            <li><router-link to="/privacy">Политика конфиденциальности</router-link></li>
            <li><router-link to="/contacts">Контакты</router-link></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Amakawe. Все права защищены.</p>
        <p class="disclaimer">
          Сайт не хранит контент на своих серверах. 
          Все материалы предоставлены третьими лицами.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { Send, Share2, MessageCircle } from 'lucide-vue-next'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: rgba(10, 10, 25, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 4rem;
  padding: 3rem 0 1.5rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.footer-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  transform: translateY(-3px);
}

.icon {
  width: 20px;
  height: 20px;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #718096;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: #667eea;
  padding-left: 4px;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.footer-bottom p {
  color: #4a5568;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.disclaimer {
  font-size: 0.85rem;
  color: #2d3748;
}

@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer {
    padding: 2rem 0 1rem;
  }
}
</style>