<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 360px">
      <q-card-section>
        <div class="text-h5 q-mb-md">Вход в ToDo App</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="fields.email.value"
            outlined
            dense
            label="Email"
            type="email"
            class="q-mb-sm"
            :error="!!errors.email"
            :error-message="errors.email ?? ''"
            @blur="touch('email')"
            @update:model-value="fields.email.dirty = true"
          />

          <q-input
            v-model="fields.password.value"
            outlined
            dense
            label="Пароль"
            :type="showPassword ? 'text' : 'password'"
            class="q-mb-md"
            :error="!!errors.password"
            :error-message="errors.password ?? ''"
            @blur="touch('password')"
            @update:model-value="fields.password.dirty = true"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Войти"
            unelevated
            full-width
            :loading="isLoading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores'
import { useValidation } from '../composables/useValidation'
import { useErrorHandler } from '../composables/useErrorHandler'
import { emailRules, passwordRules } from '../utils/validation'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { handleAppError } = useErrorHandler('LoginPage')

const isLoading = ref<boolean>(false)
const showPassword = ref<boolean>(false)

const { fields, errors, validate, touch } = useValidation(
  { email: '', password: '' },
  { email: emailRules, password: passwordRules },
)

async function handleLogin(): Promise<void> {
  if (!validate()) return

  isLoading.value = true
  const result = await userStore.login(fields.email.value, fields.password.value)
  isLoading.value = false

  if (!result.success) {
    handleAppError(result.error)
    return
  }

  const redirect = route.query.redirect
  await router.push(typeof redirect === 'string' ? redirect : { name: 'index' })
}
</script>
