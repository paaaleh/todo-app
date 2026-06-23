import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import type { ApiResult } from '../types'

export interface UserPreferences {
  itemsPerPage: number
  showCompletedByDefault: boolean
}

export interface UserProfile {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: UserProfile | null
  preferences: UserPreferences
}

const DEFAULT_PREFERENCES: UserPreferences = {
  itemsPerPage: 20,
  showCompletedByDefault: true,
}

export const useUserStore = defineStore('user', () => {
  const stored = useLocalStorage<AuthState>('user_state', {
    user: null,
    preferences: DEFAULT_PREFERENCES,
  })

  const isAuthenticated = computed<boolean>(() => stored.value.user !== null)
  const currentUser = computed<UserProfile | null>(() => stored.value.user)
  const preferences = computed<UserPreferences>(() => stored.value.preferences)

  /** Mock-аутентификация: принимает любые непустые данные */
  async function login(name: string, email: string): Promise<ApiResult<UserProfile>> {
    if (!name.trim() || !email.trim()) {
      return {
        success: false,
        error: { kind: 'validation', message: 'Имя и email обязательны' },
      }
    }

    const user: UserProfile = { id: 1, name: name.trim(), email: email.trim() }
    stored.value = { ...stored.value, user }
    return { success: true, data: user }
  }

  function logout(): void {
    stored.value = { ...stored.value, user: null }
  }

  function updatePreferences(patch: Partial<UserPreferences>): void {
    stored.value = {
      ...stored.value,
      preferences: { ...stored.value.preferences, ...patch },
    }
  }

  return { isAuthenticated, currentUser, preferences, login, logout, updatePreferences }
})
