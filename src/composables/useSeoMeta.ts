import { watch } from 'vue'
import { useRoute } from 'vue-router'

interface SeoMeta {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogUrl?: string
}

const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? 'ToDo App'
const BASE_URL = import.meta.env.VITE_BASE_URL ?? '/'

function setMetaTag(name: string, content: string, property = false): void {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

export function applyMeta(meta: SeoMeta): void {
  const title = meta.title ? `${meta.title} | ${APP_TITLE}` : APP_TITLE
  document.title = title

  if (meta.description) {
    setMetaTag('description', meta.description)
  }

  setMetaTag('og:title', meta.ogTitle ?? title, true)
  setMetaTag('og:description', meta.ogDescription ?? meta.description ?? APP_TITLE, true)
  setMetaTag('og:url', meta.ogUrl ?? (BASE_URL + window.location.pathname), true)
  setMetaTag('og:type', 'website', true)
}

/**
 * Composable для управления SEO мета-тегами.
 * Автоматически обновляет теги при навигации на основе route.meta.
 */
export function useSeoMeta(): void {
  const route = useRoute()

  watch(
    () => route.meta,
    (meta) => {
      applyMeta({ title: meta.title as string | undefined })
    },
    { immediate: true },
  )
}
