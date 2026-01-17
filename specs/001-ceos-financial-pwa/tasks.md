# Tasks: CEOs Financial Management PWA

**Input**: Design documents from `/specs/001-ceos-financial-pwa/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js monorepo (single project structure)
- **Root paths**: `src/`, `prisma/`, `public/`, `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 14+ project with TypeScript and App Router in project root
- [x] T002 Install core dependencies: tailwindcss, framer-motion, recharts, prisma, @prisma/client, dexie, jspdf, jspdf-autotable, zod
- [x] T003 [P] Configure Tailwind CSS with RTL support and glassmorphism theme in tailwind.config.ts
- [x] T004 [P] Create CSS variables and dark theme in src/app/globals.css
- [x] T005 [P] Configure ESLint and Prettier for TypeScript in .eslintrc.json and .prettierrc
- [x] T006 [P] Create TypeScript path aliases in tsconfig.json
- [x] T007 Setup PWA manifest in public/manifest.json with Hebrew app name and icons
- [x] T008 [P] Create .env.example with DATABASE_URL, SESSION_SECRET, NEXT_PUBLIC_APP_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create Prisma schema with User, Transaction, Category models in prisma/schema.prisma per data-model.md
- [x] T010 Run initial Prisma migration: npx prisma migrate dev --name init
- [x] T011 Create Prisma client singleton in src/lib/db/prisma.ts
- [x] T012 [P] Create TypeScript interfaces matching Prisma models in src/types/models.ts
- [x] T013 [P] Create Zod validation schemas for API requests in src/types/schemas.ts
- [x] T014 Create root layout with RTL dir="rtl" lang="he" and dark theme in src/app/layout.tsx
- [x] T015 [P] Create reusable GlassCard component with glassmorphism styling in src/components/ui/GlassCard.tsx
- [x] T016 [P] Create Button component with accent colors (blue/green/red) in src/components/ui/Button.tsx
- [x] T017 [P] Create Input component with RTL support in src/components/ui/Input.tsx
- [x] T018 [P] Create Select dropdown component in src/components/ui/Select.tsx
- [x] T019 [P] Create DatePicker component (no future dates) in src/components/ui/DatePicker.tsx
- [x] T020 Create currency formatter utility (₪ symbol, RTL) in src/utils/format.ts
- [x] T021 [P] Create validation utilities in src/utils/validation.ts
- [x] T022 Setup IndexedDB offline queue with Dexie.js in src/lib/sync/offline-queue.ts
- [x] T023 Create sync service with last-write-wins conflict resolution in src/lib/sync/sync-service.ts
- [x] T024 Create useOnlineStatus hook for network detection in src/hooks/useOnlineStatus.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 8 - Access App / Demo Mode (Priority: P1) 🎯 MVP

**Goal**: Enable users to sign in with a single click and access the app with demo data

**Independent Test**: Click "Sign in with Google" button and verify access to app with demo user data

### Implementation for User Story 8

- [x] T025 [US8] Create session management utilities in src/lib/auth/session.ts
- [x] T026 [US8] Create demo user seeding script in prisma/seed.ts with default categories
- [x] T027 [US8] Implement POST /api/auth/login route (demo mode) in src/app/api/auth/login/route.ts
- [x] T028 [US8] Implement POST /api/auth/logout route in src/app/api/auth/logout/route.ts
- [x] T029 [US8] Implement GET /api/auth/me route in src/app/api/auth/me/route.ts
- [x] T030 [US8] Create auth middleware for protected routes in src/middleware.ts
- [x] T031 [US8] Create login page with Google sign-in button UI in src/app/(auth)/login/page.tsx
- [x] T032 [US8] Create AuthContext provider for user state in src/components/providers/AuthProvider.tsx
- [x] T033 [US8] Create useAuth hook in src/hooks/useAuth.ts
- [x] T034 [US8] Create protected route layout in src/app/(main)/layout.tsx

**Checkpoint**: Users can sign in and access protected pages

---

## Phase 4: User Story 1 - Record Daily Expense (Priority: P1) 🎯 MVP

**Goal**: Enable users to quickly log expenses with amount, category, payment method, and optional description

**Independent Test**: Enter expense ₪50 for "Food" with "Card" payment, verify balance decreases and transaction appears in list

### Implementation for User Story 1

- [x] T035 [US1] Implement GET /api/categories route in src/app/api/categories/route.ts
- [x] T036 [US1] Implement POST /api/transactions route (create expense) in src/app/api/transactions/route.ts
- [x] T037 [US1] Create ExpenseForm component with amount, category, payment method, date, description fields in src/components/forms/ExpenseForm.tsx
- [x] T038 [US1] Create CategorySelector component showing 8 categories in src/components/forms/CategorySelector.tsx
- [x] T039 [US1] Create PaymentMethodSelector component (Cash/Card toggle) in src/components/forms/PaymentMethodSelector.tsx
- [x] T040 [US1] Create AmountInput component with ₪ prefix in src/components/forms/AmountInput.tsx
- [x] T041 [US1] Create home page with balance card and add expense button in src/app/(main)/page.tsx
- [x] T042 [US1] Create BalanceCard component showing total balance in src/components/ui/BalanceCard.tsx
- [x] T043 [US1] Create expense entry modal/sheet in src/components/forms/ExpenseModal.tsx
- [x] T044 [US1] Implement offline expense creation in ExpenseForm using offline-queue.ts
- [x] T045 [US1] Add expense to balance calculation in BalanceCard

**Checkpoint**: User Story 1 (Record Expense) is fully functional and testable

---

## Phase 5: User Story 2 - Record Income (Priority: P1)

**Goal**: Enable users to log income with amount, source, and optional description

**Independent Test**: Enter income ₪1000 with source "Salary", verify balance increases and transaction appears in list

### Implementation for User Story 2

- [x] T046 [US2] Extend POST /api/transactions to handle income type in src/app/api/transactions/route.ts
- [x] T047 [US2] Create IncomeForm component with amount, source, date, description fields in src/components/forms/IncomeForm.tsx
- [x] T048 [US2] Create SourceInput component for income source in src/components/forms/SourceInput.tsx
- [x] T049 [US2] Add income button to home page in src/app/(main)/page.tsx
- [x] T050 [US2] Create income entry modal/sheet in src/components/forms/IncomeModal.tsx
- [x] T051 [US2] Implement offline income creation in IncomeForm using offline-queue.ts
- [x] T052 [US2] Update balance calculation to include income in BalanceCard

**Checkpoint**: User Stories 1 AND 2 (Core Transaction Entry) are both functional

---

## Phase 6: User Story 4 - Filter and Browse Transactions (Priority: P2)

**Goal**: Enable users to filter transactions by month/year and browse transaction history

**Independent Test**: Create transactions in multiple months, filter by specific month, verify only that month's transactions appear

### Implementation for User Story 4

- [ ] T053 [US4] Implement GET /api/transactions with pagination and filters in src/app/api/transactions/route.ts
- [ ] T054 [US4] Implement GET /api/dashboard/available-months route in src/app/api/dashboard/available-months/route.ts
- [ ] T055 [US4] Create MonthFilter component (dropdown showing months with data) in src/components/ui/MonthFilter.tsx
- [ ] T056 [US4] Create TransactionList component with scrollable list in src/components/transactions/TransactionList.tsx
- [ ] T057 [US4] Create TransactionItem component showing amount, category, date, description in src/components/transactions/TransactionItem.tsx
- [ ] T058 [US4] Create transactions page with filter and list in src/app/(main)/transactions/page.tsx
- [ ] T059 [US4] Implement GET /api/transactions/{id} route in src/app/api/transactions/[id]/route.ts
- [ ] T060 [US4] Implement PUT /api/transactions/{id} route (edit) in src/app/api/transactions/[id]/route.ts
- [ ] T061 [US4] Implement DELETE /api/transactions/{id} route in src/app/api/transactions/[id]/route.ts
- [ ] T062 [US4] Create transaction edit modal in src/components/transactions/EditTransactionModal.tsx
- [ ] T063 [US4] Create delete confirmation dialog in src/components/ui/ConfirmDialog.tsx
- [ ] T064 [US4] Add edit/delete actions to TransactionItem

**Checkpoint**: Users can browse, filter, edit, and delete transactions

---

## Phase 7: User Story 3 - View Financial Dashboard (Priority: P2)

**Goal**: Display visual summaries with donut chart (income vs expenses) and net bottom line

**Independent Test**: Enter multiple transactions, view dashboard, verify donut chart shows correct income/expense percentages

### Implementation for User Story 3

- [ ] T065 [US3] Implement GET /api/dashboard/summary route in src/app/api/dashboard/summary/route.ts
- [ ] T066 [US3] Implement GET /api/dashboard/category-breakdown route in src/app/api/dashboard/category-breakdown/route.ts
- [ ] T067 [US3] Create DonutChart component using Recharts in src/components/charts/DonutChart.tsx
- [ ] T068 [US3] Create PieChart component for category breakdown in src/components/charts/PieChart.tsx
- [ ] T069 [US3] Create NetBottomLine component showing net amount and percentage in src/components/dashboard/NetBottomLine.tsx
- [ ] T070 [US3] Create SummaryCard component for income/expense totals in src/components/dashboard/SummaryCard.tsx
- [ ] T071 [US3] Create dashboard page with month filter and charts in src/app/(main)/dashboard/page.tsx
- [ ] T072 [US3] Integrate MonthFilter with dashboard data fetching
- [ ] T073 [US3] Add category breakdown section to dashboard

**Checkpoint**: Dashboard displays visual analytics for selected month

---

## Phase 8: User Story 5 - View Yearly Trends (Priority: P2)

**Goal**: Display bar chart comparing monthly income/expenses across the year

**Independent Test**: Enter transactions across 6 months, view trends, verify bar chart shows monthly comparison

### Implementation for User Story 5

- [ ] T074 [US5] Implement GET /api/dashboard/monthly-trends route in src/app/api/dashboard/monthly-trends/route.ts
- [ ] T075 [US5] Create BarChart component using Recharts (green income, red expenses) in src/components/charts/BarChart.tsx
- [ ] T076 [US5] Create YearSelector component in src/components/ui/YearSelector.tsx
- [ ] T077 [US5] Add yearly trends section to dashboard in src/app/(main)/dashboard/page.tsx
- [ ] T078 [US5] Style bar chart with RTL support and theme colors

**Checkpoint**: Dashboard includes yearly trends visualization

---

## Phase 9: User Story 6 - Manage Expense Categories (Priority: P3)

**Goal**: Allow users to rename categories and archive unused ones (soft-delete)

**Independent Test**: Rename "Fun" to "Entertainment", verify new expenses use updated name, historical data unchanged

### Implementation for User Story 6

- [ ] T079 [US6] Implement PUT /api/categories/{id} route in src/app/api/categories/[id]/route.ts
- [ ] T080 [US6] Implement POST /api/categories/{id}/archive route in src/app/api/categories/[id]/archive/route.ts
- [ ] T081 [US6] Implement POST /api/categories/{id}/restore route in src/app/api/categories/[id]/restore/route.ts
- [ ] T082 [US6] Create CategoryManager component in src/components/settings/CategoryManager.tsx
- [ ] T083 [US6] Create CategoryEditRow component with rename/archive actions in src/components/settings/CategoryEditRow.tsx
- [ ] T084 [US6] Create settings page with category management in src/app/(main)/settings/page.tsx
- [ ] T085 [US6] Add validation to prevent archiving last active category

**Checkpoint**: Users can customize expense categories

---

## Phase 10: User Story 7 - Export Financial Summary (Priority: P3)

**Goal**: Generate PDF reports for monthly or yearly financial summaries

**Independent Test**: Select January 2026, click "Export to PDF", verify PDF contains income/expense totals and category breakdown

### Implementation for User Story 7

- [ ] T086 [US7] Create PDF generation utility using jspdf in src/lib/pdf/generator.ts
- [ ] T087 [US7] Create RTL-aware PDF layout templates in src/lib/pdf/templates.ts
- [ ] T088 [US7] Implement GET /api/export/pdf route in src/app/api/export/pdf/route.ts
- [ ] T089 [US7] Create ExportButton component in src/components/ui/ExportButton.tsx
- [ ] T090 [US7] Add monthly export button to dashboard
- [ ] T091 [US7] Add yearly export option to dashboard
- [ ] T092 [US7] Handle "no data" edge case with appropriate message

**Checkpoint**: Users can export PDF summaries

---

## Phase 11: User Story 9 - Receive Daily Reminders (Priority: P3)

**Goal**: Send 20:00 push notification if no transactions entered today

**Independent Test**: Enable notifications, don't enter any transactions, verify reminder appears at 20:00

### Implementation for User Story 9

- [ ] T093 [US9] Create notification permission request flow in src/lib/notifications/permissions.ts
- [ ] T094 [US9] Create notification messages array with Hebrew text in src/lib/notifications/messages.ts
- [ ] T095 [US9] Create service worker for scheduled notifications in public/sw.js
- [ ] T096 [US9] Implement notification scheduling logic in src/lib/notifications/scheduler.ts
- [ ] T097 [US9] Create useNotifications hook in src/hooks/useNotifications.ts
- [ ] T098 [US9] Add notification toggle to settings page
- [ ] T099 [US9] Register service worker in src/app/layout.tsx

**Checkpoint**: Daily reminders work for users with notifications enabled

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T100 [P] Configure next-pwa for service worker and offline caching in next.config.js
- [ ] T101 [P] Create PWA icons (192x192, 512x512) in public/icons/
- [ ] T102 [P] Add Framer Motion animations to modals and page transitions
- [ ] T103 [P] Create loading skeletons for charts and lists in src/components/ui/Skeleton.tsx
- [ ] T104 [P] Add error boundary component in src/components/ErrorBoundary.tsx
- [ ] T105 Implement background sync trigger on online event in src/lib/sync/sync-service.ts
- [ ] T106 [P] Create empty state components for no transactions in src/components/ui/EmptyState.tsx
- [ ] T107 [P] Add navigation component (bottom nav for mobile) in src/components/layout/BottomNav.tsx
- [ ] T108 Test RTL layout across all pages and fix any visual glitches
- [ ] T109 Performance optimization: add database indexes per data-model.md
- [ ] T110 [P] Create 404 and error pages in src/app/not-found.tsx and src/app/error.tsx
- [ ] T111 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 8 (Phase 3)**: Depends on Foundational - BLOCKS all other user stories (auth required)
- **User Stories 1-2 (Phases 4-5)**: Depend on US8 (auth) - Core MVP
- **User Stories 3-5 (Phases 6-8)**: Depend on US8 (auth), benefit from US1/US2 data
- **User Stories 6-7, 9 (Phases 9-11)**: Depend on US8 (auth), can run in parallel with US3-5
- **Polish (Phase 12)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US8 (Auth)**: MUST complete first - all other stories require authentication
- **US1 (Expense)**: Can start after US8 - No dependencies on other stories
- **US2 (Income)**: Can start after US8 - Can run parallel with US1
- **US4 (Browse/Filter)**: Benefits from US1/US2 data but independently testable
- **US3 (Dashboard)**: Benefits from US1/US2/US4 data but independently testable
- **US5 (Trends)**: Builds on US3 dashboard components
- **US6 (Categories)**: Independent, only needs US8
- **US7 (Export)**: Benefits from dashboard data aggregation (US3)
- **US9 (Notifications)**: Independent, only needs US8

### Within Each User Story

- API routes before UI components
- Shared components before page-specific components
- Core implementation before edge case handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- US1 and US2 can run in parallel after US8 completes
- US3, US4, US5 can run in parallel after US1/US2 (or independently)
- US6, US7, US9 can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all [P] tasks from Phase 2 together:
Task: "Create TypeScript interfaces matching Prisma models in src/types/models.ts"
Task: "Create Zod validation schemas for API requests in src/types/schemas.ts"
Task: "Create reusable GlassCard component in src/components/ui/GlassCard.tsx"
Task: "Create Button component in src/components/ui/Button.tsx"
Task: "Create Input component in src/components/ui/Input.tsx"
Task: "Create Select dropdown component in src/components/ui/Select.tsx"
Task: "Create DatePicker component in src/components/ui/DatePicker.tsx"
Task: "Create validation utilities in src/utils/validation.ts"
```

## Parallel Example: User Stories 1 & 2

```bash
# After US8 (Auth) completes, launch US1 and US2 in parallel:

# US1 Team:
Task: "Create ExpenseForm component in src/components/forms/ExpenseForm.tsx"
Task: "Create CategorySelector component in src/components/forms/CategorySelector.tsx"
Task: "Create PaymentMethodSelector component in src/components/forms/PaymentMethodSelector.tsx"

# US2 Team:
Task: "Create IncomeForm component in src/components/forms/IncomeForm.tsx"
Task: "Create SourceInput component in src/components/forms/SourceInput.tsx"
Task: "Create income entry modal in src/components/forms/IncomeModal.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 8 + 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 8 (Auth) - enables all other work
4. Complete Phase 4: User Story 1 (Expense entry)
5. Complete Phase 5: User Story 2 (Income entry)
6. **STOP and VALIDATE**: Test expense/income entry flow
7. Deploy/demo if ready - users can track finances!

### Incremental Delivery

1. Setup + Foundational + US8 → Authentication works
2. Add US1 + US2 → Core transaction entry (MVP!)
3. Add US4 → Transaction browsing and filtering
4. Add US3 + US5 → Visual analytics dashboard
5. Add US6 → Category customization
6. Add US7 → PDF export
7. Add US9 → Push notifications
8. Polish → PWA optimization, animations, error handling

### Suggested MVP Scope

**Minimum viable product**: Phases 1-5 (Setup + Foundational + US8 + US1 + US2)
- Users can sign in
- Users can add expenses with category and payment method
- Users can add income with source
- Users see current balance
- **Value delivered**: Basic expense tracking working!

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All monetary amounts display with ₪ symbol (RTL)
- All UI must be RTL-aware with Hebrew text
- Dark theme only (no light mode toggle needed)
