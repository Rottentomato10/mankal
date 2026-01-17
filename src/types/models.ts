// Type definitions matching Prisma models

export type TransactionType = 'INCOME' | 'EXPENSE'
export type PaymentMethod = 'CASH' | 'CARD'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  categoryId: string | null
  type: TransactionType
  amount: number
  date: Date
  paymentMethod: PaymentMethod | null
  source: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
  // Denormalized for display
  categoryName?: string
}

export interface Category {
  id: string
  userId: string
  name: string
  displayOrder: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

// API response types
export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  incomePercentage: number
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  total: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expenses: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// Offline queue types
export type OfflineOperation = 'CREATE' | 'UPDATE' | 'DELETE'
export type OfflineEntityType = 'transaction' | 'category'
export type OfflineStatus = 'PENDING' | 'SYNCING' | 'FAILED'

export interface OfflineQueueItem {
  id: string
  operation: OfflineOperation
  entityType: OfflineEntityType
  entityId: string
  payload: Record<string, unknown> | null
  createdAt: Date
  status: OfflineStatus
}

export interface SyncOperation {
  id: string
  operation: OfflineOperation
  entityType: OfflineEntityType
  entityId: string
  payload: Record<string, unknown> | null
  clientTimestamp: Date
}

export interface SyncResult {
  operationId: string
  status: 'SUCCESS' | 'CONFLICT_RESOLVED' | 'ERROR'
  entity?: Record<string, unknown>
  error?: string
}
