interface SentryEvent {
  message: string
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  extra?: Record<string, unknown>
}

interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'score'
}

const IS_PRODUCTION = import.meta.env.MODE === 'production'
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

/** Инициализирует Sentry (mock для продакшена без реального DSN) */
export function initSentry(): void {
  if (!IS_PRODUCTION || !SENTRY_DSN) return

  console.info('[Sentry] Initialised with DSN:', SENTRY_DSN.slice(0, 20) + '...')
}

/** Отправляет событие в Sentry (или логирует в dev) */
export function captureException(error: unknown, extra?: Record<string, unknown>): void {
  if (IS_PRODUCTION && SENTRY_DSN) {
    console.error('[Sentry] captureException', error, extra)
  } else {
    console.error('[Monitoring]', error, extra)
  }
}

/** Отправляет произвольное событие */
export function captureEvent(event: SentryEvent): void {
  if (IS_PRODUCTION && SENTRY_DSN) {
    console.info('[Sentry] captureEvent', event)
  } else {
    console.info('[Monitoring]', event.level.toUpperCase(), event.message, event.extra)
  }
}

/** Замеряет Web Vitals — CLS, LCP, FID */
export function measureWebVitals(onMetric: (metric: PerformanceMetric) => void): void {
  if (!('performance' in window)) return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        onMetric({ name: 'LCP', value: entry.startTime, unit: 'ms' })
      }
      if (entry.entryType === 'layout-shift') {
        const cls = entry as PerformanceEntry & { value: number }
        onMetric({ name: 'CLS', value: cls.value, unit: 'score' })
      }
    }
  })

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    observer.observe({ type: 'layout-shift', buffered: true })
  } catch {
    // Браузер не поддерживает некоторые типы PerformanceObserver
  }

  window.addEventListener('load', () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (nav) {
      onMetric({ name: 'TTFB', value: nav.responseStart - nav.requestStart, unit: 'ms' })
      onMetric({ name: 'DOMLoad', value: nav.domContentLoadedEventEnd, unit: 'ms' })
    }
  })
}

/** Логирует метрику производительности */
export function logMetric(metric: PerformanceMetric): void {
  if (ENABLE_ANALYTICS) {
    console.info(`[Metric] ${metric.name}: ${metric.value}${metric.unit}`)
  }
}
