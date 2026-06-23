import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from 'src/components/TodoForm.vue'

describe('TodoForm', () => {
  describe('rendering', () => {
    it('renders an input field', () => {
      const wrapper = mount(TodoForm)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('renders a submit button', () => {
      const wrapper = mount(TodoForm)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('input starts empty', () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('form submission', () => {
    it('emits "add" with trimmed title on valid submit', async () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      await input.setValue('  Buy milk  ')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')).toBeTruthy()
      expect(wrapper.emitted('add')![0]).toEqual(['Buy milk'])
    })

    it('does not emit "add" for empty input', async () => {
      const wrapper = mount(TodoForm)
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')).toBeFalsy()
    })

    it('does not emit "add" for whitespace-only input', async () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      await input.setValue('   ')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')).toBeFalsy()
    })

    it('clears input after successful submission', async () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      await input.setValue('Buy milk')
      await wrapper.find('form').trigger('submit')
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('does not clear input after failed validation', async () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      await input.setValue('a')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')).toBeFalsy()
    })
  })

  describe('validation feedback', () => {
    it('marks field as dirty when input changes', async () => {
      const wrapper = mount(TodoForm)
      const input = wrapper.find('input')
      await input.setValue('something')
      const vm = wrapper.vm as unknown as { fields: { title: { dirty: boolean } } }
      expect(vm.fields.title.dirty).toBe(true)
    })

    it('marks field as touched on blur', async () => {
      const wrapper = mount(TodoForm)
      await wrapper.find('input').trigger('blur')
      const vm = wrapper.vm as unknown as { fields: { title: { touched: boolean } } }
      expect(vm.fields.title.touched).toBe(true)
    })
  })
})
