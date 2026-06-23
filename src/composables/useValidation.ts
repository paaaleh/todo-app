import { reactive, computed, readonly } from 'vue'
import type { ValidatorFn, FormFieldValue } from '../utils/validation'
import { validateField, isFormValid, extractValues } from '../utils/formHelpers'
import type { FormState, FormErrors, FormSchema } from '../utils/formHelpers'

export interface UseValidationReturn<T extends Record<string, FormFieldValue>> {
  fields: FormState<T>
  errors: Readonly<FormErrors<T>>
  isValid: Readonly<boolean>
  isDirty: Readonly<boolean>
  touch: (field: keyof T) => void
  touchAll: () => void
  validate: () => boolean
  reset: () => void
  getValue: () => T
}

/**
 * Composable для управления состоянием и валидацией форм.
 * Хранит значения, ошибки, touched/dirty флаги для каждого поля.
 */
export function useValidation<T extends Record<string, FormFieldValue>>(
  initialValues: T,
  schema: FormSchema<T>,
): UseValidationReturn<T> {
  const fields = reactive(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [
        key,
        {
          value: initialValues[key as keyof T],
          error: null as string | null,
          touched: false,
          dirty: false,
        },
      ]),
    ),
  ) as FormState<T>

  const errors = computed<FormErrors<T>>(() =>
    Object.fromEntries(
      Object.keys(fields).map((key) => {
        const k = key as keyof T
        const field = fields[k]
        if (!field.touched && !field.dirty) return [key, null]
        const rules = schema[k] as ValidatorFn<FormFieldValue>[]
        return [key, validateField(field.value as FormFieldValue, rules)]
      }),
    ) as FormErrors<T>,
  )

  const isValid = computed<boolean>(() => {
    const allErrors = Object.fromEntries(
      Object.keys(fields).map((key) => {
        const k = key as keyof T
        const rules = schema[k] as ValidatorFn<FormFieldValue>[]
        return [key, validateField(fields[k].value as FormFieldValue, rules)]
      }),
    ) as FormErrors<T>
    return isFormValid(allErrors)
  })

  const isDirty = computed<boolean>(() =>
    Object.values(fields).some((f) => (f as { dirty: boolean }).dirty),
  )

  function touch(field: keyof T): void {
    fields[field].touched = true
  }

  function touchAll(): void {
    for (const key of Object.keys(fields)) {
      fields[key as keyof T].touched = true
    }
  }

  function validate(): boolean {
    touchAll()
    return isValid.value
  }

  function reset(): void {
    for (const key of Object.keys(fields)) {
      const k = key as keyof T
      fields[k].value = initialValues[k] as FormState<T>[keyof T]['value']
      fields[k].error = null
      fields[k].touched = false
      fields[k].dirty = false
    }
  }

  function getValue(): T {
    return extractValues(fields)
  }

  return {
    fields,
    errors: readonly(errors) as unknown as Readonly<FormErrors<T>>,
    isValid: isValid as unknown as Readonly<boolean>,
    isDirty: isDirty as unknown as Readonly<boolean>,
    touch,
    touchAll,
    validate,
    reset,
    getValue,
  }
}
