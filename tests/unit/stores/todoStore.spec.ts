import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from 'src/stores/todoStore'
import { useUiStore } from 'src/stores/uiStore'
import * as todoApiService from 'src/services/todoApiService'
import type { ITodoItem } from 'src/types'

vi.mock('src/stores/userStore', () => ({
  useUserStore: () => ({
    currentUser: { id: 1, name: 'Test', email: 'test@test.com' },
    isAuthenticated: true,
    preferences: { itemsPerPage: 20, showCompletedByDefault: true },
  }),
}))

vi.mock('src/services/todoApiService')

const mockTodo: ITodoItem = {
  id: 1,
  title: 'Test task',
  completed: false,
  createdAt: new Date('2024-01-01'),
}

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty todos', () => {
      const store = useTodoStore()
      expect(store.todos).toHaveLength(0)
    })

    it('starts with filter "all"', () => {
      const store = useTodoStore()
      expect(store.filter).toBe('all')
    })

    it('starts with empty searchQuery', () => {
      const store = useTodoStore()
      expect(store.searchQuery).toBe('')
    })
  })

  describe('addTodo()', () => {
    it('adds a todo via API and updates store', async () => {
      vi.spyOn(todoApiService.todoApiService, 'create').mockResolvedValue({
        success: true,
        data: mockTodo,
      })

      const store = useTodoStore()
      const result = await store.addTodo('Test task')

      expect(result).toBe(true)
      expect(store.todos).toHaveLength(1)
      expect(store.todos[0].title).toBe('Test task')
    })

    it('rejects empty title and shows notification', async () => {
      const store = useTodoStore()
      const uiStore = useUiStore()
      const result = await store.addTodo('')

      expect(result).toBe(false)
      expect(store.todos).toHaveLength(0)
      expect(uiStore.notifications.length).toBeGreaterThan(0)
    })

    it('rejects whitespace-only title', async () => {
      const store = useTodoStore()
      const result = await store.addTodo('   ')
      expect(result).toBe(false)
    })

    it('handles API error gracefully', async () => {
      vi.spyOn(todoApiService.todoApiService, 'create').mockResolvedValue({
        success: false,
        error: { kind: 'storage', message: 'Network error' },
      })

      const store = useTodoStore()
      const uiStore = useUiStore()
      const result = await store.addTodo('Valid task')

      expect(result).toBe(false)
      expect(store.todos).toHaveLength(0)
      expect(uiStore.notifications.length).toBeGreaterThan(0)
    })
  })

  describe('removeTodo()', () => {
    it('removes a todo via API', async () => {
      vi.spyOn(todoApiService.todoApiService, 'create').mockResolvedValue({
        success: true,
        data: mockTodo,
      })
      vi.spyOn(todoApiService.todoApiService, 'remove').mockResolvedValue({
        success: true,
        data: 1,
      })

      const store = useTodoStore()
      await store.addTodo('Test task')
      const result = await store.removeTodo(1)

      expect(result).toBe(true)
      expect(store.todos).toHaveLength(0)
    })

    it('shows notification on API error', async () => {
      vi.spyOn(todoApiService.todoApiService, 'remove').mockResolvedValue({
        success: false,
        error: { kind: 'not_found', message: 'Not found', id: 99 },
      })

      const store = useTodoStore()
      const uiStore = useUiStore()
      const result = await store.removeTodo(99)

      expect(result).toBe(false)
      expect(uiStore.notifications.length).toBeGreaterThan(0)
    })
  })

  describe('toggleTodo()', () => {
    it('toggles completion via API', async () => {
      vi.spyOn(todoApiService.todoApiService, 'create').mockResolvedValue({
        success: true,
        data: mockTodo,
      })
      vi.spyOn(todoApiService.todoApiService, 'update').mockResolvedValue({
        success: true,
        data: { ...mockTodo, completed: true },
      })

      const store = useTodoStore()
      await store.addTodo('Test task')
      const result = await store.toggleTodo(1)

      expect(result).toBe(true)
      expect(store.todos[0].completed).toBe(true)
    })

    it('returns false for non-existent todo id', async () => {
      const store = useTodoStore()
      const result = await store.toggleTodo(999)
      expect(result).toBe(false)
    })
  })

  describe('setFilter()', () => {
    it('updates filter state', () => {
      const store = useTodoStore()
      store.setFilter('completed')
      expect(store.filter).toBe('completed')
    })
  })

  describe('setSearchQuery()', () => {
    it('updates search query', () => {
      const store = useTodoStore()
      store.setSearchQuery('buy')
      expect(store.searchQuery).toBe('buy')
    })
  })

  describe('computed getters', () => {
    beforeEach(async () => {
      vi.spyOn(todoApiService.todoApiService, 'create')
        .mockResolvedValueOnce({ success: true, data: { ...mockTodo, id: 1, completed: false } })
        .mockResolvedValueOnce({ success: true, data: { ...mockTodo, id: 2, completed: true } })
    })

    it('computes totalCount correctly', async () => {
      const store = useTodoStore()
      await store.addTodo('Task 1')
      await store.addTodo('Task 2')
      expect(store.totalCount).toBe(2)
    })

    it('computes activeCount correctly', async () => {
      const store = useTodoStore()
      await store.addTodo('Task 1')
      await store.addTodo('Task 2')
      expect(store.activeCount).toBe(1)
    })

    it('computes completedCount correctly', async () => {
      const store = useTodoStore()
      await store.addTodo('Task 1')
      await store.addTodo('Task 2')
      expect(store.completedCount).toBe(1)
    })
  })

  describe('clearCompleted()', () => {
    it('removes all completed todos', async () => {
      vi.spyOn(todoApiService.todoApiService, 'create')
        .mockResolvedValueOnce({ success: true, data: { ...mockTodo, id: 1, completed: false } })
        .mockResolvedValueOnce({ success: true, data: { ...mockTodo, id: 2, completed: true } })

      const store = useTodoStore()
      await store.addTodo('Active task')
      await store.addTodo('Done task')
      store.clearCompleted()

      expect(store.todos).toHaveLength(1)
      expect(store.todos[0].completed).toBe(false)
    })
  })
})
