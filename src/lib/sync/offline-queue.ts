import Dexie, { Table } from 'dexie'
import type { OfflineQueueItem, OfflineOperation, OfflineEntityType, OfflineStatus } from '@/types/models'

// Extend Dexie for our database
class OfflineDatabase extends Dexie {
  queue!: Table<OfflineQueueItem, string>

  constructor() {
    super('CEOsOfflineDB')
    this.version(1).stores({
      queue: 'id, entityType, entityId, status, createdAt',
    })
  }
}

// Singleton database instance
let db: OfflineDatabase | null = null

function getDb(): OfflineDatabase {
  if (!db) {
    db = new OfflineDatabase()
  }
  return db
}

/**
 * Generate a UUID for new queue items
 */
function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Add an operation to the offline queue
 */
export async function addToQueue(
  operation: OfflineOperation,
  entityType: OfflineEntityType,
  entityId: string,
  payload: Record<string, unknown> | null
): Promise<string> {
  const db = getDb()
  const id = generateUUID()

  const item: OfflineQueueItem = {
    id,
    operation,
    entityType,
    entityId,
    payload,
    createdAt: new Date(),
    status: 'PENDING',
  }

  await db.queue.add(item)
  return id
}

/**
 * Get all pending items from the queue
 */
export async function getPendingItems(): Promise<OfflineQueueItem[]> {
  const db = getDb()
  return db.queue.where('status').equals('PENDING').sortBy('createdAt')
}

/**
 * Get all items from the queue (for debugging)
 */
export async function getAllItems(): Promise<OfflineQueueItem[]> {
  const db = getDb()
  return db.queue.toArray()
}

/**
 * Update the status of a queue item
 */
export async function updateItemStatus(id: string, status: OfflineStatus): Promise<void> {
  const db = getDb()
  await db.queue.update(id, { status })
}

/**
 * Remove an item from the queue
 */
export async function removeFromQueue(id: string): Promise<void> {
  const db = getDb()
  await db.queue.delete(id)
}

/**
 * Remove all successfully synced items
 */
export async function clearSyncedItems(): Promise<void> {
  const db = getDb()
  // Items are removed individually after successful sync
  // This is a cleanup function for any remaining synced items
  await db.queue.where('status').equals('SUCCESS' as OfflineStatus).delete()
}

/**
 * Clear all items from the queue (use with caution)
 */
export async function clearQueue(): Promise<void> {
  const db = getDb()
  await db.queue.clear()
}

/**
 * Get the count of pending items
 */
export async function getPendingCount(): Promise<number> {
  const db = getDb()
  return db.queue.where('status').equals('PENDING').count()
}

/**
 * Check if there are any pending items
 */
export async function hasPendingItems(): Promise<boolean> {
  const count = await getPendingCount()
  return count > 0
}

/**
 * Get failed items for retry or manual intervention
 */
export async function getFailedItems(): Promise<OfflineQueueItem[]> {
  const db = getDb()
  return db.queue.where('status').equals('FAILED').toArray()
}

/**
 * Retry failed items by resetting their status to pending
 */
export async function retryFailedItems(): Promise<number> {
  const db = getDb()
  const failed = await getFailedItems()

  for (const item of failed) {
    await db.queue.update(item.id, { status: 'PENDING' })
  }

  return failed.length
}

// Export the database instance for direct access if needed
export { getDb }
