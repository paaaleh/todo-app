import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import type { ApiResult } from '../types'

export interface UseApiState<T> {
  data: Readonly<Ref<T | null>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  execute: (...args: unknown[]) => Promise<boolean>
  reset: () => void
}

/**
 * Composable для работы с ApiResult<T>.
 * Автоматически разворачивает success/error discriminated union.
 * Используется для API-вызовов через сервисный слой.
 */
export function useApi<T>(
  fn: (...args: unknown[]) => Promise<ApiResult<T>>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (message: string) => void
  } = {},
): UseApiState<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function execute(...args: unknown[]): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const result = await fn(...args)

      if (result.success) {
        data.value = result.data
        options.onSuccess?.(result.data)
        return true
      } else {
        error.value = result.error.message
        options.onError?.(result.error.message)
        return false
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      error.value = message
      options.onError?.(message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function reset(): void {
    data.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    execute,
    reset,
  }
}
