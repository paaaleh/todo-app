<template>
  <q-card>
    <q-card-section v-if="todos.length === 0">
      <div class="text-grey text-center q-py-md">Список задач пуст</div>
    </q-card-section>

    <q-list separator v-else>
      <transition-group name="todo-list" tag="div">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </transition-group>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import type { ITodoItem, TodoId } from '../types'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: ITodoItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: TodoId): void
  (e: 'delete', id: TodoId): void
}>()
</script>

<style scoped>
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
