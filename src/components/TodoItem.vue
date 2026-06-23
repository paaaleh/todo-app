<template>
  <q-item :class="todo.completed ? 'opacity-50' : ''">
    <q-item-section avatar>
      <q-checkbox
        :model-value="todo.completed"
        @update:model-value="emit('toggle', todo.id)"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="todo.completed ? 'text-strike text-grey' : ''">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption class="text-grey-6">
        {{ formattedDate }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        icon="delete"
        color="negative"
        size="sm"
        @click="emit('delete', todo.id)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ITodoItem, TodoId } from '../types'

const props = defineProps<{
  todo: ITodoItem
}>()

const emit = defineEmits<{
  (e: 'toggle', id: TodoId): void
  (e: 'delete', id: TodoId): void
}>()

/** Форматирует дату создания задачи в формат DD/MM/YYYY */
const formattedDate = computed<string>(() => {
  const d = props.todo.createdAt
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})
</script>
