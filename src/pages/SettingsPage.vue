<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <AppBreadcrumbs />

        <div class="text-h4 q-mb-md">Настройки</div>

        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Внешний вид</div>

            <q-item tag="label" class="rounded-borders">
              <q-item-section>
                <q-item-label>Тёмная тема</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="uiStore.isDark"
                  @update:model-value="uiStore.toggleTheme"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Задачи</div>

            <q-item tag="label" class="rounded-borders">
              <q-item-section>
                <q-item-label>Показывать выполненные по умолчанию</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="userStore.preferences.showCompletedByDefault"
                  @update:model-value="val => userStore.updatePreferences({ showCompletedByDefault: val })"
                />
              </q-item-section>
            </q-item>

            <q-separator class="q-my-sm" />

            <q-item>
              <q-item-section>
                <q-item-label>Задач на странице</q-item-label>
              </q-item-section>
              <q-item-section side style="min-width: 120px">
                <q-select
                  :model-value="userStore.preferences.itemsPerPage"
                  outlined
                  dense
                  :options="[10, 20, 50, 100]"
                  @update:model-value="val => userStore.updatePreferences({ itemsPerPage: val })"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <q-card v-if="userStore.currentUser">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Профиль</div>
            <q-item>
              <q-item-section avatar>
                <q-icon name="account_circle" size="40px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ userStore.currentUser.name }}</q-item-label>
                <q-item-label caption>{{ userStore.currentUser.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="negative" label="Выйти" icon="logout" @click="handleLogout" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore, useUiStore } from '../stores'
import AppBreadcrumbs from '../components/AppBreadcrumbs.vue'

const router = useRouter()
const userStore = useUserStore()
const uiStore = useUiStore()

function handleLogout(): void {
  userStore.logout()
  router.push({ name: 'login' })
}
</script>
