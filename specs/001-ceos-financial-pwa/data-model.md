# Data Model: CEOs Financial Management PWA

**Date**: 2026-01-15
**Feature**: 001-ceos-financial-pwa

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    User      │       │   Transaction    │       │   Category   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)      │
│ email        │  │    │ user_id (FK)     │────┘  │ user_id (FK) │──┐
│ name         │  └───▶│ category_id (FK) │◀──────│ name         │  │
│ created_at   │       │ type             │       │ display_order│  │
│ updated_at   │       │ amount           │       │ is_archived  │  │
└──────────────┘       │ date             │       │ created_at   │  │
       │               │ payment_method   │       │ updated_at   │  │
       │               │ source           │       └──────────────┘  │
       │               │ description      │              │          │
       │               │ created_at       │              │          │
       │               │ updated_at       │              │          │
       │               │ synced_at        │              │          │
       └──────────────▶└──────────────────┘◀─────────────┘          │
                                                                     │
                              ┌──────────────────┐                   │
                              │  OfflineQueue    │                   │
                              │  (IndexedDB)     │                   │
                              ├──────────────────┤                   │
                              │ id (PK)          │                   │
                              │ operation        │                   │
                              │ entity_type      │                   │
                              │ entity_id        │                   │
                              │ payload          │                   │
                              │ created_at       │                   │
                              │ status           │                   │
                              └──────────────────┘                   │
                                                                     │
       ┌─────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│    User      │ (Categories belong to User)
└──────────────┘
```

## Entities

### User

Represents an authenticated user of the application.

| Field      | Type         | Constraints                | Description                    |
|------------|--------------|----------------------------|--------------------------------|
| id         | UUID         | PK, auto-generated         | Unique identifier              |
| email      | String       | Unique, not null, indexed  | User's email address           |
| name       | String       | Not null                   | Display name                   |
| created_at | DateTime     | Not null, default now      | Account creation timestamp     |
| updated_at | DateTime     | Not null, auto-updated     | Last modification timestamp    |

**Validation Rules**:
- Email must be valid format (regex validation)
- Name must be 1-100 characters

**Indexes**:
- `users_email_unique` on `email`

---

### Transaction

A financial record (income or expense) belonging to a user.

| Field          | Type         | Constraints                      | Description                          |
|----------------|--------------|----------------------------------|--------------------------------------|
| id             | UUID         | PK, auto-generated               | Unique identifier                    |
| user_id        | UUID         | FK → User.id, not null, indexed  | Owner of this transaction            |
| category_id    | UUID         | FK → Category.id, nullable       | Category (expenses only)             |
| type           | Enum         | Not null, ['INCOME', 'EXPENSE']  | Transaction type                     |
| amount         | Decimal(12,2)| Not null, > 0                    | Amount in ILS (max 10,000,000.00)    |
| date           | Date         | Not null, indexed                | Transaction date (not future)        |
| payment_method | Enum         | Nullable, ['CASH', 'CARD']       | Payment method (expenses only)       |
| source         | String       | Nullable, max 100 chars          | Income source (income only)          |
| description    | String       | Nullable, max 500 chars          | Optional user description            |
| created_at     | DateTime     | Not null, default now            | Record creation timestamp            |
| updated_at     | DateTime     | Not null, auto-updated           | Last modification timestamp          |
| synced_at      | DateTime     | Nullable                         | Last server sync timestamp           |

**Validation Rules**:
- Amount must be > 0 and <= 10,000,000.00
- Date must be <= today (no future dates)
- If type = EXPENSE: category_id required, payment_method required
- If type = INCOME: source required, category_id must be null, payment_method must be null

**Indexes**:
- `transactions_user_id_date_idx` on `(user_id, date)` - for filtered queries
- `transactions_user_id_type_idx` on `(user_id, type)` - for income/expense totals
- `transactions_category_id_idx` on `category_id` - for category aggregations

**State Transitions**: None (transactions are created, updated, or deleted; no status lifecycle)

---

### Category

An expense classification with soft-delete support.

| Field         | Type     | Constraints                      | Description                         |
|---------------|----------|----------------------------------|-------------------------------------|
| id            | UUID     | PK, auto-generated               | Unique identifier                   |
| user_id       | UUID     | FK → User.id, not null, indexed  | Owner of this category              |
| name          | String   | Not null, max 50 chars           | Category display name               |
| display_order | Integer  | Not null, default 0              | Sort order in UI (1-8)              |
| is_archived   | Boolean  | Not null, default false          | Soft-delete flag                    |
| created_at    | DateTime | Not null, default now            | Record creation timestamp           |
| updated_at    | DateTime | Not null, auto-updated           | Last modification timestamp         |

**Validation Rules**:
- Name must be 1-50 characters
- display_order must be 1-8
- User can have max 8 categories
- Cannot archive if it's the last active category

**Indexes**:
- `categories_user_id_idx` on `user_id`
- `categories_user_id_order_idx` on `(user_id, display_order)`

**State Transitions**:
- Active → Archived (soft-delete: set is_archived = true)
- Archived → Active (restore: set is_archived = false)

**Default Categories** (seeded per user):
1. אוכל (Food)
2. תחבורה (Transport)
3. שכירות (Rent)
4. בילויים (Fun)
5. מתנות (Gifts)
6. ביגוד (Clothing)
7. אחר (Other)
8. חיסכון (Savings)

---

### OfflineQueue (IndexedDB - Client Only)

Queued operations for offline sync. Stored in browser IndexedDB, not server database.

| Field       | Type     | Constraints                           | Description                        |
|-------------|----------|---------------------------------------|------------------------------------|
| id          | String   | PK, UUID                              | Unique identifier                  |
| operation   | String   | Not null, ['CREATE', 'UPDATE', 'DELETE'] | Operation type                  |
| entity_type | String   | Not null, ['transaction', 'category'] | Target entity type                 |
| entity_id   | String   | Not null                              | Target entity ID                   |
| payload     | Object   | Nullable                              | Full entity data for create/update |
| created_at  | DateTime | Not null                              | Queue timestamp                    |
| status      | String   | Not null, ['PENDING', 'SYNCING', 'FAILED'] | Sync status                   |

**Sync Behavior**:
- On online: Process queue in FIFO order
- On conflict: Last-write-wins (server timestamp)
- On failure: Retry up to 3 times, then mark FAILED

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(uuid())
  email        String        @unique
  name         String
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")

  transactions Transaction[]
  categories   Category[]

  @@map("users")
}

model Transaction {
  id            String          @id @default(uuid())
  userId        String          @map("user_id")
  categoryId    String?         @map("category_id")
  type          TransactionType
  amount        Decimal         @db.Decimal(12, 2)
  date          DateTime        @db.Date
  paymentMethod PaymentMethod?  @map("payment_method")
  source        String?
  description   String?
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")
  syncedAt      DateTime?       @map("synced_at")

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category?       @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId, date])
  @@index([userId, type])
  @@index([categoryId])
  @@map("transactions")
}

model Category {
  id           String        @id @default(uuid())
  userId       String        @map("user_id")
  name         String
  displayOrder Int           @default(0) @map("display_order")
  isArchived   Boolean       @default(false) @map("is_archived")
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@index([userId])
  @@index([userId, displayOrder])
  @@map("categories")
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum PaymentMethod {
  CASH
  CARD
}
```

## Aggregation Queries

### Monthly Summary (Dashboard)

```sql
SELECT
  DATE_TRUNC('month', date) as month,
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = $1
  AND date >= $2
  AND date <= $3
GROUP BY DATE_TRUNC('month', date), type;
```

### Category Breakdown

```sql
SELECT
  c.name as category_name,
  SUM(t.amount) as total
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
  AND t.type = 'EXPENSE'
  AND t.date >= $2
  AND t.date <= $3
GROUP BY c.id, c.name
ORDER BY total DESC;
```

### Available Months (Smart Filter)

```sql
SELECT DISTINCT
  DATE_TRUNC('month', date) as month
FROM transactions
WHERE user_id = $1
ORDER BY month DESC;
```
