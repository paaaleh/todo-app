import { ref, readonly } from 'vue'
import type { Ref } from 'vue'

export interface UseAsyncState<T> {
  data: Readonly<Ref<T | null>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  execute: (...args: Parameters<() => Promise<T>>) => Promise<T | null>
  reset: () => void
}

/**
 * Composable для управления состоянием асинхронных операций.
 * Инкапсулирует isLoading, error и data без дублирования в компонентах.
 */
export function useAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  options: { immediate?: boolean } = {},
): UseAsyncState<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function execute(...args: unknown[]): Promise<T | null> {
    isLoading.value = true
    error.value = null

    try {
      const result = await fn(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
      return null
    } finally {
      isLoading.value = false
    }
  }

  function reset(): void {
    data.value = null
    isLoading.value = false
    error.value = null
  }

  if (options.immediate) {
    execute()
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    execute: execute as UseAsyncState<T>['execute'],
    reset,
  }
}
