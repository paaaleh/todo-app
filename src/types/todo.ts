export interface ITodoItem {
  id: number
  title: string
  completed: boolean
  createdAt: Date
}

export type TodoCreatePayload = Pick<ITodoItem, 'title'>

export type TodoUpdatePayload = Partial<Pick<ITodoItem, 'title' | 'completed'>>

export type FilterType = 'all' | 'active' | 'completed'

export interface TodoFilterState {
  filter: FilterType
  searchQuery: string
}

export type TodoId = ITodoItem['id']
