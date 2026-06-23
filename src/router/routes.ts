import type { RouteRecordRaw } from 'vue-router'
import type { RouteName } from '../types'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index' as RouteName,
        component: () => import('../pages/IndexPage.vue'),
        meta: {
          title: 'Список задач',
          requiresAuth: true,
          breadcrumbs: [{ label: 'Задачи' }],
        },
      },
      {
        path: 'settings',
        name: 'settings' as RouteName,
        component: () => import('../pages/SettingsPage.vue'),
        meta: {
          title: 'Настройки',
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Задачи', to: { name: 'index' as RouteName } },
            { label: 'Настройки' },
          ],
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login' as RouteName,
        component: () => import('../pages/LoginPage.vue'),
        meta: {
          title: 'Вход',
          requiresAuth: false,
          breadcrumbs: [{ label: 'Вход' }],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found' as RouteName,
    component: () => import('../pages/NotFoundPage.vue'),
    meta: {
      title: 'Страница не найдена',
      requiresAuth: false,
      breadcrumbs: [{ label: '404' }],
    },
  },
]
