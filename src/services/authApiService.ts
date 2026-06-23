import { apiClient } from './apiClient'
import type { ApiAuthResponse, ApiLoginPayload, ApiRegisterPayload, ApiUserProfile } from './types'
import type { ApiResult } from '../types'

const TOKEN_KEY = 'auth_token'

export const authApiService = {
  async login(payload: ApiLoginPayload): Promise<ApiResult<ApiAuthResponse>> {
    try {
      const data = await apiClient.post<ApiAuthResponse>('/auth/login', payload)
      localStorage.setItem(TOKEN_KEY, data.token)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: { kind: 'validation', message: (err as Error).message } }
    }
  },

  async register(payload: ApiRegisterPayload): Promise<ApiResult<ApiAuthResponse>> {
    try {
      const data = await apiClient.post<ApiAuthResponse>('/auth/register', payload)
      localStorage.setItem(TOKEN_KEY, data.token)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: { kind: 'validation', message: (err as Error).message } }
    }
  },

  async getProfile(): Promise<ApiResult<ApiUserProfile>> {
    try {
      const data = await apiClient.get<ApiUserProfile>('/users/me', undefined, true)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: { kind: 'storage', message: (err as Error).message } }
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    apiClient.invalidateCache('/users')
    apiClient.invalidateCache('/todos')
  },
}
