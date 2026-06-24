import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import { todoService } from '../services/todoService'
import { todoApiService } from '../services/todoApiService'
import { useUiStore } from './uiStore'
import { useUserStore } from './userStore'
import type { ITodoItem, TodoId, FilterType } from '../types'

interface StoredTodoItem {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

function deserializeStored(items: StoredTodoItem[]): ITodoItem[] {
  return items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
}

function serializeToStored(items: ITodoItem[]): StoredTodoItem[] {
  return items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))
}

const API_URL = import.meta.env.VITE_API_URL
const USE_API = !!API_URL && API_URL.trim() !== ''

export const useTodoStore = defineStore('todo', () => {
  const uiStore = useUiStore()
  const userStore = useUserStore()

  const stored = useLocalStorage<StoredTodoItem[]>('todos', [])
  const isLoading = ref<boolean>(false)
  const isSynced = ref<boolean>(false)
  const filter = ref<FilterType>('all')
  const searchQuery = ref<string>('')

  const todos = computed<ITodoItem[]>(() => deserializeStored(stored.value))

  const filteredTodos = computed<ITodoItem[]>(() => {
    let result = todos.value

    if (filter.value === 'active') {
      result = result.filter((t) => !t.completed)
    } else if (filter.value === 'completed') {
      result = result.filter((t) => t.completed)
    }

    const query = searchQuery.value.trim().toLowerCase()
    if (query) {
      result = result.filter((t) => t.title.toLowerCase().includes(query))
    }

    return result
  })

  const totalCount = computed<number>(() => todos.value.length)
  const activeCount = computed<number>(() => todos.value.filter((t) => !t.completed).length)
  const completedCount = computed<number>(() => todos.value.filter((t) => t.completed).length)

  async function fetchTodos(): Promise<void> {
    if (!USE_API) {
      isSynced.value = true
      return
    }

    const userId = userStore.currentUser?.id
    if (!userId) return

    isLoading.value = true
    const result = await todoApiService.getAll(userId)
    isLoading.value = false

    if (result.success) {
      stored.value = serializeToStored(result.data)
      isSynced.value = true
    } else {
      uiStore.addNotification('error', `Ошибка загрузки: ${result.error.message}`)
    }
  }

  async function addTodo(title: string): Promise<boolean> {
    const validation = todoService.create({ title }, todos.value)
    if (!validation.success) {
      uiStore.addNotification('error', validation.error.message)
      return false
    }

    if (USE_API) {
      const userId = userStore.currentUser?.id
      if (userId) {
        isLoading.value = true
        const result = await todoApiService.create(userId, { title })
        isLoading.value = false

        if (!result.success) {
          uiStore.addNotification('error', result.error.message)
          return false
        }

        stored.value = serializeToStored([...todos.value, result.data])
        uiStore.addNotification('success', 'Задача добавлена')
        return true
      }
    }

    stored.value = serializeToStored([...todos.value, validation.data])
    uiStore.addNotification('success', 'Задача добавлена')
    return true
  }

  async function removeTodo(id: TodoId): Promise<boolean> {
    if (USE_API) {
      isLoading.value = true
      const result = await todoApiService.remove(id)
      isLoading.value = false

      if (!result.success) {
        uiStore.addNotification('error', result.error.message)
        return false
      }
    }

    stored.value = serializeToStored(todos.value.filter((t) => t.id !== id))
    uiStore.addNotification('info', 'Задача удалена')
    return true
  }

  async function toggleTodo(id: TodoId): Promise<boolean> {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return false

    if (USE_API) {
      const result = await todoApiService.update(id, { completed: !todo.completed })
      if (!result.success) {
        uiStore.addNotification('error', result.error.message)
        return false
      }
      stored.value = serializeToStored(
        todos.value.map((t) => (t.id === id ? result.data : t)),
      )
      return true
    }

    stored.value = serializeToStored(
      todos.value.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
    return true
  }

  function setFilter(value: FilterType): void {
    filter.value = value
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function clearCompleted(): void {
    stored.value = serializeToStored(todos.value.filter((t) => !t.completed))
    uiStore.addNotification('info', 'Выполненные задачи удалены')
  }

  return {
    todos,
    filteredTodos,
    isLoading,
    isSynced,
    filter,
    searchQuery,
    totalCount,
    activeCount,
    completedCount,
    fetchTodos,
    addTodo,
    removeTodo,
    toggleTodo,
    setFilter,
    setSearchQuery,
    clearCompleted,
  }
})
