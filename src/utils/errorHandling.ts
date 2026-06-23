import type { AppError } from '../types'

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'

export interface NormalizedError {
  message: string
  userMessage: string
  severity: ErrorSeverity
  code: string
  retryable: boolean
}

const USER_MESSAGES: Record<AppError['kind'], string> = {
  validation: 'Проверьте правильность введённых данных',
  not_found: 'Запрошенный ресурс не найден',
  storage: 'Ошибка при сохранении данных. Попробуйте позже',
  unknown: 'Что-то пошло не так. Попробуйте обновить страницу',
}

const SEVERITY_MAP: Record<AppError['kind'], ErrorSeverity> = {
  validation: 'warning',
  not_found: 'error',
  storage: 'error',
  unknown: 'fatal',
}

/** Нормализует AppError в единый формат для отображения и логирования */
export function normalizeAppError(error: AppError): NormalizedError {
  return {
    message: error.message,
    userMessage: USER_MESSAGES[error.kind],
    severity: SEVERITY_MAP[error.kind],
    code: error.kind,
    retryable: error.kind === 'storage' || error.kind === 'unknown',
  }
}

/** Нормализует произвольную ошибку JS */
export function normalizeUnknownError(err: unknown): NormalizedError {
  const message = err instanceof Error ? err.message : String(err)
  return {
    message,
    userMessage: 'Произошла неожиданная ошибка. Пожалуйста, попробуйте ещё раз',
    severity: 'error',
    code: 'unknown',
    retryable: true,
  }
}

/** Определяет, является ли ошибка сетевой */
export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return (
    err.message.includes('Network Error') ||
    err.message.includes('timeout') ||
    err.message.includes('ECONNREFUSED')
  )
}

/** Логирует ошибку без утечки технических деталей в UI */
export function logError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString()
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${timestamp}] [${context}] ${message}`, error)
}

/** Устанавливает глобальный обработчик необработанных ошибок */
export function setupGlobalErrorHandlers(
  onError: (message: string, severity: ErrorSeverity) => void,
): void {
  window.onerror = (message, _source, _lineno, _colno, error) => {
    logError('GlobalError', error ?? message)
    onError('Критическая ошибка приложения. Перезагрузите страницу', 'fatal')
    return false
  }

  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    logError('UnhandledRejection', event.reason)
    if (isNetworkError(event.reason)) {
      onError('Ошибка сети. Проверьте подключение к интернету', 'error')
    } else {
      onError('Необработанная ошибка', 'error')
    }
  }
}
