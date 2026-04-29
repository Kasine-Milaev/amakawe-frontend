import { tg } from '..plugins/telegram'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin

export const authService = {
  async telegramAuth(userData) {
    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },
  getGoogleAuthUrl() {
    return `${API_URL}/api/auth/google`
  },
  async handleGoogleCallback(code) {
    const response = await fetch(`${API_URL}/api/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },
  getVkAuthUrl() {
    return `${API_URL}/api/auth/vk`
  },
  async handleVkCallback(code) {
    const response = await fetch(`${API_URL}/api/auth/vk/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },
  async checkAuth() {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        return data.user
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
    return null
  },
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default authService