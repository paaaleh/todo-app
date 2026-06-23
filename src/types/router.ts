export type RouteName = 'index' | 'login' | 'settings' | 'not-found'

export interface BreadcrumbItem {
  label: string
  to?: { name: RouteName }
}

export interface RouteMetaRecord {
  title: string
  requiresAuth: boolean
  breadcrumbs: BreadcrumbItem[]
}

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaRecord {}
}
