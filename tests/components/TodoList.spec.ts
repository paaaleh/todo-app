import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from 'src/components/TodoList.vue'
import type { ITodoItem } from 'src/types'

const makeTodo = (overrides: Partial<ITodoItem> = {}): ITodoItem => ({
  id: 1,
  title: 'Default',
  completed: false,
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

const todos: ITodoItem[] = [
  makeTodo({ id: 1, title: 'Buy groceries', completed: false }),
  makeTodo({ id: 2, title: 'Read a book', completed: true }),
  makeTodo({ id: 3, title: 'Write tests', completed: false }),
]

describe('TodoList', () => {
  describe('rendering', () => {
    it('shows empty state message when todos is empty', () => {
      const wrapper = mount(TodoList, { props: { todos: [] } })
      expect(wrapper.text()).toContain('пуст')
    })

    it('does not show empty state when todos are present', () => {
      const wrapper = mount(TodoList, { props: { todos } })
      expect(wrapper.text()).not.toContain('пуст')
    })

    it('renders a TodoItem for each todo', () => {
      const wrapper = mount(TodoList, { props: { todos } })
      const items = wrapper.findAllComponents({ name: 'TodoItem' })
      expect(items).toHaveLength(3)
    })

    it('renders correct todo titles', () => {
      const wrapper = mount(TodoList, { props: { todos } })
      expect(wrapper.text()).toContain('Buy groceries')
      expect(wrapper.text()).toContain('Read a book')
      expect(wrapper.text()).toContain('Write tests')
    })
  })

  describe('event forwarding', () => {
    it('forwards "toggle" event from TodoItem with correct id', async () => {
      const wrapper = mount(TodoList, { props: { todos } })
      const firstItem = wrapper.findComponent({ name: 'TodoItem' })
      await firstItem.vm.$emit('toggle', 1)
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual([1])
    })

    it('forwards "delete" event from TodoItem with correct id', async () => {
      const wrapper = mount(TodoList, { props: { todos } })
      const firstItem = wrapper.findComponent({ name: 'TodoItem' })
      await firstItem.vm.$emit('delete', 2)
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0]).toEqual([2])
    })
  })

  describe('reactivity', () => {
    it('updates rendered list when todos prop changes', async () => {
      const wrapper = mount(TodoList, { props: { todos: [makeTodo({ id: 1, title: 'Task A' })] } })
      expect(wrapper.findAllComponents({ name: 'TodoItem' })).toHaveLength(1)

      await wrapper.setProps({
        todos: [
          makeTodo({ id: 1, title: 'Task A' }),
          makeTodo({ id: 2, title: 'Task B' }),
        ],
      })
      expect(wrapper.findAllComponents({ name: 'TodoItem' })).toHaveLength(2)
    })

    it('shows empty state after all todos are removed', async () => {
      const wrapper = mount(TodoList, { props: { todos } })
      await wrapper.setProps({ todos: [] })
      expect(wrapper.text()).toContain('пуст')
    })
  })
})
