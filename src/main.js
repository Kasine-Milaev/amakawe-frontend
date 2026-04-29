import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import telegramPlugin from './plugins/telegram'

const app = createApp(App)

const tgUser = telegramPlugin.initTelegram()
if (tgUser) {
  console.log('✅ Telegram user initialized:', tgUser.username)
}

app.use(createPinia())
app.use(router)
app.mount('#app')