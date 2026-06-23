import type { ITodoItem, TodoCreatePayload, TodoUpdatePayload, TodoId } from '../types'
import type { ApiResult, AppError, ValidationRule } from '../types'

const titleRules: ValidationRule<string>[] = [
  {
    field: 'title',
    validate: (v) => v.trim().length > 0,
    message: 'Название задачи не может быть пустым',
  },
  {
    field: 'title',
    validate: (v) => v.trim().length <= 200,
    message: 'Название задачи не может превышать 200 символов',
  },
]

function validateTitle(title: string): AppError | null {
  for (const rule of titleRules) {
    if (!rule.validate(title)) {
      return { kind: 'validation', message: rule.message, field: rule.field }
    }
  }
  return null
}

function ok<T>(data: T): ApiResult<T> {
  return { success: true, data }
}

function fail(error: AppError): ApiResult<never> {
  return { success: false, error }
}

export const todoService = {
  /**
   * Создаёт новую задачу с валидацией payload.
   */
  create(payload: TodoCreatePayload, currentItems: ITodoItem[]): ApiResult<ITodoItem> {
    const error = validateTitle(payload.title)
    if (error) return fail(error)

    const id = currentItems.length > 0 ? Math.max(...currentItems.map((t) => t.id)) + 1 : 1
    const item: ITodoItem = {
      id,
      title: payload.title.trim(),
      completed: false,
      createdAt: new Date(),
    }
    return ok(item)
  },

  /**
   * Применяет частичное обновление к задаче.
   */
  update(
    id: TodoId,
    payload: TodoUpdatePayload,
    currentItems: ITodoItem[],
  ): ApiResult<ITodoItem> {
    const existing = currentItems.find((t) => t.id === id)
    if (!existing) {
      return fail({ kind: 'not_found', message: `Задача с id ${id} не найдена`, id })
    }

    if (payload.title !== undefined) {
      const error = validateTitle(payload.title)
      if (error) return fail(error)
    }

    const updated: ITodoItem = {
      ...existing,
      ...(payload.title !== undefined ? { title: payload.title.trim() } : {}),
      ...(payload.completed !== undefined ? { completed: payload.completed } : {}),
    }
    return ok(updated)
  },

  /**
   * Проверяет существование задачи перед удалением.
   */
  remove(id: TodoId, currentItems: ITodoItem[]): ApiResult<TodoId> {
    const exists = currentItems.some((t) => t.id === id)
    if (!exists) {
      return fail({ kind: 'not_found', message: `Задача с id ${id} не найдена`, id })
    }
    return ok(id)
  },
}
