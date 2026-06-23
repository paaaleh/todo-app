import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorBody } from './types'

const TOKEN_KEY = 'auth_token'
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 500
const CACHE_TTL_MS = 30_000

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

function invalidateCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true
  return error.response.status >= 500
}

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorBody>) => {
      const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number }

      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = '/login'
        return Promise.reject(error)
      }

      config._retryCount = (config._retryCount ?? 0)

      if (isRetryable(error) && config._retryCount < MAX_RETRIES) {
        config._retryCount += 1
        await sleep(RETRY_DELAY_MS * config._retryCount)
        return instance.request(config)
      }

      const message =
        error.response?.data?.error ??
        error.message ??
        'Неизвестная ошибка'

      return Promise.reject(new Error(message))
    },
  )

  return instance
}

const axiosInstance = createAxiosInstance()

export const apiClient = {
  async get<T>(path: string, config?: AxiosRequestConfig, useCache = false): Promise<T> {
    if (useCache) {
      const cached = getCached<T>(path)
      if (cached !== null) return cached
    }
    const { data } = await axiosInstance.get<T>(path, config)
    if (useCache) setCache(path, data)
    return data
  },

  async post<T>(path: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.post<T>(path, body, config)
    return data
  },

  async put<T>(path: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.put<T>(path, body, config)
    return data
  },

  async patch<T>(path: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.patch<T>(path, body, config)
    return data
  },

  async delete<T = void>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.delete<T>(path, config)
    return data
  },

  invalidateCache,
  setCache,
  getCached,
}
