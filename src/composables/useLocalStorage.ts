import { ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Реактивное хранилище с синхронизацией в localStorage.
 * При инициализации читает сохранённое значение, при изменении — записывает.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const parsed: T = stored ? (JSON.parse(stored) as T) : defaultValue

  const data = ref<T>(parsed) as Ref<T>

  watch(
    data,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true },
  )

  return data
}
