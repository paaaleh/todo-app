import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

config.global.stubs = {
  'q-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  'q-input': {
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />',
    props: ['modelValue'],
    emits: ['update:modelValue', 'blur'],
  },
  'q-checkbox': {
    template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
  'q-form': { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
  'q-item': { template: '<div><slot /></div>' },
  'q-item-section': { template: '<div><slot /></div>' },
  'q-item-label': { template: '<span><slot /></span>' },
  'q-list': { template: '<ul><slot /></ul>' },
  'q-card': { template: '<div><slot /></div>' },
  'q-card-section': { template: '<div><slot /></div>' },
  'q-icon': { template: '<span />' },
  'q-banner': { template: '<div><slot /></div>' },
  'q-btn-toggle': { template: '<div />' },
  'q-breadcrumbs': { template: '<nav><slot /></nav>' },
  'q-breadcrumbs-el': { template: '<span><slot /></span>' },
  'q-inner-loading': { template: '<div />' },
  'q-spinner-gears': { template: '<div />' },
  'router-view': { template: '<div />' },
  RouterLink: { template: '<a><slot /></a>' },
}

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useRoute: () => ({
      meta: { breadcrumbs: [], title: 'Test', requiresAuth: false },
      query: {},
      params: {},
      fullPath: '/',
    }),
  }
})
