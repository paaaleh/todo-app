import { describe, it, expect, beforeEach } from 'vitest'
import { computed, ref } from 'vue'
import { useTodoFilter } from 'src/composables/useTodoFilter'
import type { ITodoItem } from 'src/types'

function makeTodo(overrides: Partial<ITodoItem> = {}): ITodoItem {
  return {
    id: 1,
    title: 'Default task',
    completed: false,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  }
}

const mockTodos: ITodoItem[] = [
  makeTodo({ id: 1, title: 'Buy groceries', completed: false }),
  makeTodo({ id: 2, title: 'Read a book', completed: true }),
  makeTodo({ id: 3, title: 'Buy coffee', completed: false }),
  makeTodo({ id: 4, title: 'Write tests', completed: true }),
]

describe('useTodoFilter', () => {
  let todosRef: ReturnType<typeof computed<ITodoItem[]>>

  beforeEach(() => {
    todosRef = computed(() => mockTodos)
  })

  describe('filter: all', () => {
    it('returns all todos when filter is "all"', () => {
      const { filter, filteredTodos } = useTodoFilter(todosRef)
      filter.value = 'all'
      expect(filteredTodos.value).toHaveLength(4)
    })
  })

  describe('filter: active', () => {
    it('returns only incomplete todos', () => {
      const { filter, filteredTodos } = useTodoFilter(todosRef)
      filter.value = 'active'
      expect(filteredTodos.value).toHaveLength(2)
      expect(filteredTodos.value.every((t) => !t.completed)).toBe(true)
    })
  })

  describe('filter: completed', () => {
    it('returns only completed todos', () => {
      const { filter, filteredTodos } = useTodoFilter(todosRef)
      filter.value = 'completed'
      expect(filteredTodos.value).toHaveLength(2)
      expect(filteredTodos.value.every((t) => t.completed)).toBe(true)
    })
  })

  describe('search', () => {
    it('filters by search query case-insensitively', () => {
      const { searchQuery, filteredTodos } = useTodoFilter(todosRef)
      searchQuery.value = 'BUY'
      expect(filteredTodos.value).toHaveLength(2)
      expect(filteredTodos.value.map((t) => t.title)).toContain('Buy groceries')
      expect(filteredTodos.value.map((t) => t.title)).toContain('Buy coffee')
    })

    it('returns empty array when no match', () => {
      const { searchQuery, filteredTodos } = useTodoFilter(todosRef)
      searchQuery.value = 'zzznomatch'
      expect(filteredTodos.value).toHaveLength(0)
    })

    it('ignores leading/trailing whitespace in query', () => {
      const { searchQuery, filteredTodos } = useTodoFilter(todosRef)
      searchQuery.value = '  book  '
      expect(filteredTodos.value).toHaveLength(1)
    })
  })

  describe('combined filter and search', () => {
    it('applies both filter and search together', () => {
      const { filter, searchQuery, filteredTodos } = useTodoFilter(todosRef)
      filter.value = 'active'
      searchQuery.value = 'buy'
      expect(filteredTodos.value).toHaveLength(2)
      expect(filteredTodos.value.every((t) => !t.completed)).toBe(true)
    })
  })

  describe('filterState', () => {
    it('returns correct filterState snapshot', () => {
      const { filter, searchQuery, filterState } = useTodoFilter(todosRef)
      filter.value = 'completed'
      searchQuery.value = 'test'
      expect(filterState.value).toEqual({ filter: 'completed', searchQuery: 'test' })
    })
  })

  describe('reactivity', () => {
    it('reacts to changes in source todos', () => {
      const source = ref<ITodoItem[]>([...mockTodos])
      const todosComputed = computed(() => source.value)
      const { filteredTodos } = useTodoFilter(todosComputed)

      expect(filteredTodos.value).toHaveLength(4)

      source.value = source.value.filter((t) => t.id !== 1)
      expect(filteredTodos.value).toHaveLength(3)
    })
  })
})
