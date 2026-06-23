import type { Router } from 'vue-router'
import { useUserStore } from '../stores'

export function registerGuards(router: Router): void {
  router.beforeEach((to, _from) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.name === 'login' && userStore.isAuthenticated) {
      return { name: 'index' }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = `${to.meta.title} | ToDo App`
  })
}
