import { apiClient } from './apiClient'
import type { ApiTodoItem, ApiCreateTodoPayload, ApiUpdateTodoPayload } from './types'
import type { ITodoItem, TodoCreatePayload, TodoUpdatePayload, TodoId, ApiResult } from '../types'

const CACHE_KEY_PREFIX = '/todos'

function deserialize(item: ApiTodoItem): ITodoItem {
  return {
    id: item.id,
    title: item.title,
    completed: item.completed,
    createdAt: new Date(item.createdAt),
  }
}

export const todoApiService = {
  async getAll(userId: number): Promise<ApiResult<ITodoItem[]>> {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}?userId=${userId}`
      const items = await apiClient.get<ApiTodoItem[]>(
        `/todos?userId=${userId}`,
        undefined,
        true,
      )
      return { success: true, data: items.map(deserialize) }
    } catch (err) {
      return { success: false, error: { kind: 'storage', message: (err as Error).message } }
    }
  },

  async create(userId: number, payload: TodoCreatePayload): Promise<ApiResult<ITodoItem>> {
    try {
      const body: ApiCreateTodoPayload = {
        userId,
        title: payload.title,
        completed: false,
        tagIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const item = await apiClient.post<ApiTodoItem>('/todos', body)
      apiClient.invalidateCache(CACHE_KEY_PREFIX)
      return { success: true, data: deserialize(item) }
    } catch (err) {
      return { success: false, error: { kind: 'storage', message: (err as Error).message } }
    }
  },

  async update(id: TodoId, payload: TodoUpdatePayload): Promise<ApiResult<ITodoItem>> {
    try {
      const body: ApiUpdateTodoPayload = {
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      const item = await apiClient.patch<ApiTodoItem>(`/todos/${id}`, body)
      apiClient.invalidateCache(CACHE_KEY_PREFIX)
      return { success: true, data: deserialize(item) }
    } catch (err) {
      return { success: false, error: { kind: 'not_found', message: (err as Error).message, id } }
    }
  },

  async remove(id: TodoId): Promise<ApiResult<TodoId>> {
    try {
      await apiClient.delete(`/todos/${id}`)
      apiClient.invalidateCache(CACHE_KEY_PREFIX)
      return { success: true, data: id }
    } catch (err) {
      return { success: false, error: { kind: 'not_found', message: (err as Error).message, id } }
    }
  },
}
