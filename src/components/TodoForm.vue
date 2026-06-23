<template>
  <q-form @submit.prevent="handleSubmit">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-sm items-start">
          <div class="col">
            <q-input
              v-model="fields.title.value"
              outlined
              dense
              placeholder="Введите название задачи"
              :error="!!errors.title"
              :error-message="errors.title ?? ''"
              @blur="touch('title')"
              @update:model-value="fields.title.dirty = true"
            />
          </div>
          <div class="col-auto">
            <q-btn
              type="submit"
              color="primary"
              icon="add"
              label="Добавить"
              unelevated
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { useValidation } from '../composables/useValidation'
import { todoTitleRules } from '../utils/validation'

const emit = defineEmits<{
  (e: 'add', title: string): void
}>()

const { fields, errors, validate, reset, touch } = useValidation(
  { title: '' },
  { title: todoTitleRules },
)

function handleSubmit(): void {
  if (!validate()) return
  emit('add', fields.title.value.trim())
  reset()
}
</script>
