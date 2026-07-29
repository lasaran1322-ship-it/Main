import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const register = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      user.value = JSON.parse(stored)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loadFromStorage
  }
})
