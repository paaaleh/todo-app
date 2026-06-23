export type ValidatorFn<T = string> = (value: T) => string | true

export interface FieldRules<T = string> {
  rules: ValidatorFn<T>[]
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validators = {
  required(message = 'Поле обязательно для заполнения'): ValidatorFn {
    return (value) => (value.trim().length > 0 ? true : message)
  },

  minLength(min: number, message?: string): ValidatorFn {
    return (value) =>
      value.trim().length >= min
        ? true
        : (message ?? `Минимальная длина — ${min} символов`)
  },

  maxLength(max: number, message?: string): ValidatorFn {
    return (value) =>
      value.trim().length <= max
        ? true
        : (message ?? `Максимальная длина — ${max} символов`)
  },

  email(message = 'Введите корректный email'): ValidatorFn {
    return (value) => (EMAIL_RE.test(value.trim()) ? true : message)
  },

  pattern(re: RegExp, message: string): ValidatorFn {
    return (value) => (re.test(value) ? true : message)
  },

  noWhitespaceOnly(message = 'Значение не может состоять только из пробелов'): ValidatorFn {
    return (value) => (value.trim().length > 0 ? true : message)
  },
}

export const todoTitleRules: ValidatorFn[] = [
  validators.required('Название задачи обязательно'),
  validators.minLength(2, 'Название должно содержать минимум 2 символа'),
  validators.maxLength(200, 'Название не может превышать 200 символов'),
  validators.noWhitespaceOnly(),
]

export const emailRules: ValidatorFn[] = [
  validators.required('Email обязателен'),
  validators.email(),
]

export const passwordRules: ValidatorFn[] = [
  validators.required('Пароль обязателен'),
  validators.minLength(6, 'Пароль должен содержать минимум 6 символов'),
]

export const nameRules: ValidatorFn[] = [
  validators.required('Имя обязательно'),
  validators.minLength(2, 'Имя должно содержать минимум 2 символа'),
  validators.maxLength(100),
]

/** Запускает все правила и возвращает первую ошибку или null */
export function validate<T = string>(value: T, rules: ValidatorFn<T>[]): string | null {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) return result
  }
  return null
}

/** Асинхронная проверка уникальности email через API */
export async function checkEmailUnique(
  email: string,
  checkFn: (email: string) => Promise<boolean>,
): Promise<string | true> {
  const isUnique = await checkFn(email)
  return isUnique ? true : 'Пользователь с таким email уже существует'
}
