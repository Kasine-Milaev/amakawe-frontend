import { onMounted } from 'vue'

export function useTelegram() {
  let tg = null

  onMounted(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      tg = window.Telegram.WebApp
      tg.expand()
    }
  })

  return {
    tg,
    user: tg?.initDataUnsafe?.user || null,
    version: tg?.version || null
  }
}