import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import { Dark } from 'quasar'

export type ThemeMode = 'light' | 'dark'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timeout?: number
}

interface UiState {
  theme: ThemeMode
  sidebarVisible: boolean
  filterPanelVisible: boolean
}

interface NotificationQueue {
  items: Notification[]
  nextId: number
}

import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const stored = useLocalStorage<UiState>('ui_state', {
    theme: 'light',
    sidebarVisible: true,
    filterPanelVisible: true,
  })

  const notificationQueue = ref<NotificationQueue>({ items: [], nextId: 1 })

  const theme = computed<ThemeMode>(() => stored.value.theme)
  const isDark = computed<boolean>(() => stored.value.theme === 'dark')
  const sidebarVisible = computed<boolean>(() => stored.value.sidebarVisible)
  const filterPanelVisible = computed<boolean>(() => stored.value.filterPanelVisible)
  const notifications = computed<Notification[]>(() => notificationQueue.value.items)

  function applyTheme(mode: ThemeMode): void {
    Dark.set(mode === 'dark')
  }

  function initTheme(): void {
    applyTheme(stored.value.theme)
  }

  function toggleTheme(): void {
    const next: ThemeMode = stored.value.theme === 'light' ? 'dark' : 'light'
    stored.value = { ...stored.value, theme: next }
    applyTheme(next)
  }

  function setTheme(mode: ThemeMode): void {
    stored.value = { ...stored.value, theme: mode }
    applyTheme(mode)
  }

  function toggleSidebar(): void {
    stored.value = { ...stored.value, sidebarVisible: !stored.value.sidebarVisible }
  }

  function toggleFilterPanel(): void {
    stored.value = { ...stored.value, filterPanelVisible: !stored.value.filterPanelVisible }
  }

  function addNotification(
    type: Notification['type'],
    message: string,
    timeout = 3000,
  ): number {
    const id = notificationQueue.value.nextId++
    notificationQueue.value.items = [
      ...notificationQueue.value.items,
      { id, type, message, timeout },
    ]
    if (timeout > 0) {
      setTimeout(() => removeNotification(id), timeout)
    }
    return id
  }

  function removeNotification(id: number): void {
    notificationQueue.value.items = notificationQueue.value.items.filter((n) => n.id !== id)
  }

  function clearNotifications(): void {
    notificationQueue.value.items = []
  }

  return {
    theme,
    isDark,
    sidebarVisible,
    filterPanelVisible,
    notifications,
    initTheme,
    toggleTheme,
    setTheme,
    toggleSidebar,
    toggleFilterPanel,
    addNotification,
    removeNotification,
    clearNotifications,
  }
})
