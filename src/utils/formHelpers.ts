import type { ValidatorFn } from './validation'

export type FormFieldValue = string | boolean | number

export interface FormField<T extends FormFieldValue = string> {
  value: T
  error: string | null
  touched: boolean
  dirty: boolean
}

export type FormSchema<T extends Record<string, FormFieldValue>> = {
  [K in keyof T]: ValidatorFn<T[K]>[]
}

export type FormState<T extends Record<string, FormFieldValue>> = {
  [K in keyof T]: FormField<T[K]>
}

export type FormErrors<T extends Record<string, FormFieldValue>> = {
  [K in keyof T]: string | null
}

/** Создаёт начальное состояние поля формы */
export function createField<T extends FormFieldValue>(value: T): FormField<T> {
  return { value, error: null, touched: false, dirty: false }
}

/** Запускает все правила для значения поля, возвращает первую ошибку */
export function validateField<T extends FormFieldValue>(
  value: T,
  rules: ValidatorFn<T>[],
): string | null {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) return result
  }
  return null
}

/** Возвращает true если все поля формы без ошибок */
export function isFormValid<T extends Record<string, FormFieldValue>>(
  errors: FormErrors<T>,
): boolean {
  return Object.values(errors).every((e) => e === null)
}

/** Собирает значения из FormState в plain объект */
export function extractValues<T extends Record<string, FormFieldValue>>(
  state: FormState<T>,
): T {
  return Object.fromEntries(
    Object.entries(state).map(([k, field]) => [k, (field as FormField).value]),
  ) as T
}
