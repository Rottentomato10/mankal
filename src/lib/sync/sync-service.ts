import {
  getPendingItems,
  updateItemStatus,
  removeFromQueue,
  hasPendingItems,
} from './offline-queue'
import type { OfflineQueueItem, SyncOperation, SyncResult } from '@/types/models'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

/**
 * Convert offline queue item to sync operation format
 */
function toSyncOperation(item: OfflineQueueItem): SyncOperation {
  return {
    id: item.id,
    operation: item.operation,
    entityType: item.entityType,
    entityId: item.entityId,
    payload: item.payload,
    clientTimestamp: item.createdAt,
  }
}

/**
 * Send operations to the server for syncing
 */
async function sendToServer(operations: SyncOperation[]): Promise<{
  results: SyncResult[]
  serverTimestamp: string
}> {
  const response = await fetch('/api/transactions/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operations }),
  })

  if (!response.ok) {
    throw new Error(`Sync failed with status ${response.status}`)
  }

  return response.json()
}

/**
 * Process a single sync result
 */
async function processSyncResult(result: SyncResult): Promise<void> {
  if (result.status === 'SUCCESS' || result.status === 'CONFLICT_RESOLVED') {
    // Remove successfully synced item from queue
    await removeFromQueue(result.operationId)
  } else if (result.status === 'ERROR') {
    // Mark as failed
    await updateItemStatus(result.operationId, 'FAILED')
    console.error(`Sync error for operation ${result.operationId}:`, result.error)
  }
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Sync all pending offline operations to the server
 * Uses batch processing with retry logic
 */
export async function syncPendingOperations(): Promise<{
  synced: number
  failed: number
  total: number
}> {
  const pendingItems = await getPendingItems()

  if (pendingItems.length === 0) {
    return { synced: 0, failed: 0, total: 0 }
  }

  let synced = 0
  let failed = 0
  const total = pendingItems.length

  // Mark all as syncing
  for (const item of pendingItems) {
    await updateItemStatus(item.id, 'SYNCING')
  }

  // Convert to sync operations
  const operations = pendingItems.map(toSyncOperation)

  // Attempt sync with retries
  let retries = 0
  let success = false

  while (retries < MAX_RETRIES && !success) {
    try {
      const { results } = await sendToServer(operations)

      // Process each result
      for (const result of results) {
        await processSyncResult(result)
        if (result.status === 'SUCCESS' || result.status === 'CONFLICT_RESOLVED') {
          synced++
        } else {
          failed++
        }
      }

      success = true
    } catch (error) {
      retries++
      console.warn(`Sync attempt ${retries} failed:`, error)

      if (retries < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * retries) // Exponential backoff
      } else {
        // Mark all as failed after max retries
        for (const item of pendingItems) {
          await updateItemStatus(item.id, 'FAILED')
        }
        failed = total
      }
    }
  }

  return { synced, failed, total }
}

/**
 * Check if sync is needed and perform if online
 */
export async function checkAndSync(): Promise<boolean> {
  if (!navigator.onLine) {
    console.log('Offline - skipping sync')
    return false
  }

  const hasPending = await hasPendingItems()
  if (!hasPending) {
    return true // Nothing to sync
  }

  const result = await syncPendingOperations()
  console.log(`Sync complete: ${result.synced} synced, ${result.failed} failed`)

  return result.failed === 0
}

/**
 * Register online event listener for automatic sync
 */
export function registerOnlineListener(): () => void {
  const handleOnline = () => {
    console.log('Back online - starting sync')
    checkAndSync().catch(console.error)
  }

  window.addEventListener('online', handleOnline)

  return () => {
    window.removeEventListener('online', handleOnline)
  }
}

/**
 * Get sync status for UI display
 */
export async function getSyncStatus(): Promise<{
  hasPending: boolean
  isOnline: boolean
  pendingCount: number
}> {
  const { getPendingCount } = await import('./offline-queue')
  const pendingCount = await getPendingCount()

  return {
    hasPending: pendingCount > 0,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingCount,
  }
}
