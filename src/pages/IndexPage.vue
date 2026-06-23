<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <AppBreadcrumbs />

        <div class="row items-center justify-between q-mb-md">
          <div class="text-h4">Список задач</div>
          <div class="text-caption text-grey">
            Всего: {{ todoStore.totalCount }} /
            Активных: {{ todoStore.activeCount }} /
            Выполнено: {{ todoStore.completedCount }}
          </div>
        </div>

        <TodoForm class="q-mb-md" @add="todoStore.addTodo" />

        <q-card v-if="uiStore.filterPanelVisible" class="q-mb-md">
          <q-card-section>
            <q-input
              :model-value="todoStore.searchQuery"
              outlined
              dense
              placeholder="Поиск задач..."
              clearable
              debounce="200"
              @update:model-value="val => todoStore.setSearchQuery(String(val ?? ''))"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn-toggle
              :model-value="todoStore.filter"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="filterOptions"
              @update:model-value="val => todoStore.setFilter(val as FilterType)"
            />
          </q-card-section>

          <q-card-section v-if="todoStore.completedCount > 0" class="q-pt-none">
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Удалить выполненные"
              icon="delete_sweep"
              @click="todoStore.clearCompleted"
            />
          </q-card-section>
        </q-card>

        <TodoList
          :todos="todoStore.filteredTodos"
          @toggle="todoStore.toggleTodo"
          @delete="todoStore.removeTodo"
        />
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div class="column q-gutter-sm items-end">
        <q-btn
          round
          :icon="uiStore.isDark ? 'light_mode' : 'dark_mode'"
          color="primary"
          @click="uiStore.toggleTheme"
        />
        <q-btn
          round
          icon="filter_list"
          color="secondary"
          @click="uiStore.toggleFilterPanel"
        />
      </div>
    </q-page-sticky>

    <q-inner-loading :showing="todoStore.isLoading">
      <q-spinner-gears size="48px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore, useUiStore } from '../stores'
import type { FilterType } from '../types'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'
import AppBreadcrumbs from '../components/AppBreadcrumbs.vue'

const todoStore = useTodoStore()
const uiStore = useUiStore()

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Выполненные', value: 'completed' },
]

onMounted(async () => {
  if (!todoStore.isSynced) {
    await todoStore.fetchTodos()
  }
})
</script>
