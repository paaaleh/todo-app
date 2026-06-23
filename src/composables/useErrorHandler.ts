import { useUiStore } from '../stores'
import type { AppError } from '../types'
import { normalizeAppError, normalizeUnknownError, logError } from '../utils/errorHandling'
import type { ErrorSeverity } from '../utils/errorHandling'

const SEVERITY_TO_NOTIF: Record<ErrorSeverity, 'error' | 'warning' | 'info'> = {
  fatal: 'error',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

/**
 * Composable для централизованной обработки ошибок.
 * Нормализует, логирует и показывает уведомление через uiStore.
 */
export function useErrorHandler(context: string) {
  const uiStore = useUiStore()

  function handleAppError(error: AppError): void {
    const normalized = normalizeAppError(error)
    logError(context, new Error(normalized.message))
    const notifType = SEVERITY_TO_NOTIF[normalized.severity]
    uiStore.addNotification(notifType, normalized.userMessage)
  }

  function handleUnknownError(err: unknown): void {
    const normalized = normalizeUnknownError(err)
    logError(context, err)
    const notifType = SEVERITY_TO_NOTIF[normalized.severity]
    uiStore.addNotification(notifType, normalized.userMessage)
  }

  function handle(err: AppError | unknown): void {
    if (
      err !== null &&
      typeof err === 'object' &&
      'kind' in err
    ) {
      handleAppError(err as AppError)
    } else {
      handleUnknownError(err)
    }
  }

  return { handleAppError, handleUnknownError, handle }
}
