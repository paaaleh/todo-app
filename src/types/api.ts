export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiError = {
  success: false
  error: AppError
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

export type AppError =
  | { kind: 'validation'; message: string; field?: string }
  | { kind: 'not_found'; message: string; id: number }
  | { kind: 'storage'; message: string }
  | { kind: 'unknown'; message: string }

export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
  field?: string
}
