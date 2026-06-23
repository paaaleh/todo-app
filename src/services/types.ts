export interface ApiTodoItem {
  id: number
  userId: number
  title: string
  completed: boolean
  tagIds: number[]
  createdAt: string
  updatedAt: string
}

export interface ApiTag {
  id: number
  name: string
  color: string
}

export interface ApiUserProfile {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface ApiAuthResponse {
  token: string
  user: ApiUserProfile
}

export interface ApiLoginPayload {
  email: string
  password: string
}

export interface ApiRegisterPayload {
  name: string
  email: string
  password: string
}

export interface ApiCreateTodoPayload {
  userId: number
  title: string
  completed: boolean
  tagIds: number[]
  createdAt: string
  updatedAt: string
}

export interface ApiUpdateTodoPayload {
  title?: string
  completed?: boolean
  updatedAt: string
}

export interface ApiErrorBody {
  error: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
