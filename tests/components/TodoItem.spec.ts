import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from 'src/components/TodoItem.vue'
import type { ITodoItem } from 'src/types'

const makeTodo = (overrides: Partial<ITodoItem> = {}): ITodoItem => ({
  id: 1,
  title: 'Test task',
  completed: false,
  createdAt: new Date('2024-03-15'),
  ...overrides,
})

describe('TodoItem', () => {
  describe('rendering', () => {
    it('renders the todo title', () => {
      const wrapper = mount(TodoItem, { props: { todo: makeTodo({ title: 'Buy milk' }) } })
      expect(wrapper.text()).toContain('Buy milk')
    })

    it('renders the createdAt date in DD/MM/YYYY format', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: makeTodo({ createdAt: new Date('2024-03-15') }) },
      })
      expect(wrapper.text()).toContain('15/03/2024')
    })

    it('applies opacity class for completed todo', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: makeTodo({ completed: true }) },
      })
      expect(wrapper.html()).toContain('opacity-50')
    })

    it('does not apply opacity class for active todo', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: makeTodo({ completed: false }) },
      })
      expect(wrapper.html()).not.toContain('opacity-50')
    })

    it('applies text-strike class when completed', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: makeTodo({ completed: true }) },
      })
      expect(wrapper.html()).toContain('text-strike')
    })
  })

  describe('events', () => {
    it('emits "toggle" with todo id when checkbox changes', async () => {
      const todo = makeTodo({ id: 42 })
      const wrapper = mount(TodoItem, { props: { todo } })
      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.trigger('change')
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual([42])
    })

    it('emits "delete" with todo id when delete button clicked', async () => {
      const todo = makeTodo({ id: 7 })
      const wrapper = mount(TodoItem, { props: { todo } })
      const buttons = wrapper.findAll('button')
      const deleteBtn = buttons[buttons.length - 1]
      await deleteBtn.trigger('click')
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0]).toEqual([7])
    })
  })

  describe('date formatting', () => {
    it('pads single-digit day and month', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: makeTodo({ createdAt: new Date('2024-01-05') }) },
      })
      expect(wrapper.text()).toContain('05/01/2024')
    })
  })
})
