<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="uiStore.toggleSidebar"
        />
        <q-toolbar-title>ToDo App</q-toolbar-title>

        <q-btn
          flat
          round
          :icon="uiStore.isDark ? 'light_mode' : 'dark_mode'"
          @click="uiStore.toggleTheme"
        />

        <q-btn
          v-if="userStore.isAuthenticated"
          flat
          round
          icon="logout"
          @click="handleLogout"
        >
          <q-tooltip>Выйти</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer :model-value="uiStore.sidebarVisible" show-if-above bordered>
      <q-list>
        <q-item-label header>Навигация</q-item-label>

        <q-item clickable v-ripple :to="{ name: 'index' }" exact active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="task_alt" />
          </q-item-section>
          <q-item-section>Задачи</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'settings' }" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Настройки</q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-sm" />

      <q-list v-if="userStore.currentUser">
        <q-item>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ userStore.currentUser.name }}</q-item-label>
            <q-item-label caption>{{ userStore.currentUser.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="uiStore.notifications.length > 0" class="bg-transparent q-pa-sm">
      <div class="column q-gutter-xs items-end">
        <transition-group name="notif">
          <q-banner
            v-for="notif in uiStore.notifications"
            :key="notif.id"
            :class="`bg-${notifColor(notif.type)} text-white`"
            rounded
            dense
            style="max-width: 360px"
          >
            {{ notif.message }}
            <template #action>
              <q-btn
                flat
                dense
                round
                icon="close"
                size="sm"
                @click="uiStore.removeNotification(notif.id)"
              />
            </template>
          </q-banner>
        </transition-group>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUiStore, useUserStore } from '../stores'
import type { Notification } from '../stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()
const userStore = useUserStore()

function notifColor(type: Notification['type']): string {
  const map: Record<Notification['type'], string> = {
    success: 'positive',
    error: 'negative',
    info: 'info',
    warning: 'warning',
  }
  return map[type]
}

function handleLogout(): void {
  userStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.notif-enter-active,
.notif-leave-active {
  transition: all 0.3s ease;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
