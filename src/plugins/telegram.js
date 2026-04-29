import WebApp from '@twa-dev/sdk'

export const tg = WebApp

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const initTelegram = () => {
  if (tg?.initDataUnsafe?.user) {
    const userData = {
      id: tg.initDataUnsafe.user.id,
      username: tg.initDataUnsafe.user.username,
      first_name: tg.initDataUnsafe.user.first_name,
      last_name: tg.initDataUnsafe.user.last_name,
      photo_url: tg.initDataUnsafe.user.photo_url,
      is_premium: tg.initDataUnsafe.user.is_premium,
      language_code: tg.initDataUnsafe.user.language_code,
      hash: tg.initData.split('hash=')[1]
    }
    authenticateUser(userData)
    
    setupTheme()
    
    return userData
  }
  return null
}

const authenticateUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('tg_user', JSON.stringify(data.user))
      console.log('✅ User authenticated:', data.user)
    }
  } catch (error) {
    console.error('❌ Auth failed:', error)
  }
}

export const setupTheme = () => {
  const params = tg.themeParams
  
  if (params) {
    document.documentElement.style.setProperty('--tg-bg-color', params.bg_color || '#0f0f1e')
    document.documentElement.style.setProperty('--tg-text-color', params.text_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-hint-color', params.hint_color || '#718096')
    document.documentElement.style.setProperty('--tg-link-color', params.link_color || '#667eea')
    document.documentElement.style.setProperty('--tg-button-color', params.button_color || '#667eea')
    document.documentElement.style.setProperty('--tg-button-text-color', params.button_text_color || '#ffffff')
  }
  
  tg.ready()
  tg.expand()
}

export const tgHelpers = {
  showMainButton: (text, callback) => {
    tg.MainButton.setText(text)
    tg.MainButton.onClick(callback)
    tg.MainButton.show()
  },
  
  hideMainButton: () => {
    tg.MainButton.hide()
  },
  
  showBackButton: (callback) => {
    tg.BackButton.onClick(callback)
    tg.BackButton.show()
  },
  
  hideBackButton: () => {
    tg.BackButton.hide()
  },
  
  showAlert: (message) => {
    tg.showAlert(message)
  },
  
  showConfirm: (message) => {
    return new Promise((resolve) => {
      tg.showConfirm(message, (result) => resolve(result))
    })
  },
  
  close: () => {
    tg.close()
  },
  
  openLink: (url, try_instant_view = false) => {
    tg.openLink(url, { try_instant_view })
  },
  
  sendData: (data) => {
    tg.sendData(JSON.stringify(data))
  },
  
  haptic: (type = 'light') => {
    if (tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type)
    }
  }
}

export default {
  tg,
  initTelegram,
  setupTheme,
  ...tgHelpers
}