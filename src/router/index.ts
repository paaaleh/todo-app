import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { registerGuards } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

registerGuards(router)

export default router
