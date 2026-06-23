/* eslint-disable no-console */
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

export function initSentry(): void {
  if (!IS_PRODUCTION || !SENTRY_DSN) return
  console.info('[Sentry] Initialised')
}

export function captureException(error: unknown, extra?: Record<string, unknown>): void {
  console.error('[Monitoring]', error, extra)
}

export function captureEvent(event: SentryEvent): void {
  console.info('[Monitoring]', event.level.toUpperCase(), event.message)
}

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
    // браузер не поддерживает
  }

  window.addEventListener('load', () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (nav) {
      onMetric({ name: 'TTFB', value: nav.responseStart - nav.requestStart, unit: 'ms' })
    }
  })
}

export function logMetric(metric: PerformanceMetric): void {
  if (ENABLE_ANALYTICS) {
    console.info(`[Metric] ${metric.name}: ${metric.value}${metric.unit}`)
  }
}
