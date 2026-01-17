# Research: CEOs Financial Management PWA

**Date**: 2026-01-15
**Feature**: 001-ceos-financial-pwa

## Technology Decisions

### 1. PWA Framework

**Decision**: Next.js 14+ with `next-pwa` package

**Rationale**:
- App Router provides React Server Components for faster initial loads
- Built-in API routes eliminate need for separate backend
- `next-pwa` wraps Workbox with zero-config service worker generation
- Excellent RTL support via CSS direction property
- Vercel deployment optimized out-of-box

**Alternatives Considered**:
- Vite + React: Faster dev builds, but requires separate backend setup and manual PWA config
- Remix: Good forms/data loading, but smaller ecosystem for PWA tooling
- Create React App: Deprecated, lacks server-side rendering

### 2. Offline Data Strategy

**Decision**: IndexedDB via Dexie.js for offline queue + background sync API

**Rationale**:
- IndexedDB has no storage limits (unlike localStorage 5MB)
- Dexie.js provides clean Promise-based API over raw IndexedDB
- Background Sync API allows deferred sync when online
- Simple queue pattern: write to IndexedDB immediately, sync to server when online

**Alternatives Considered**:
- localStorage: 5MB limit insufficient for transaction history
- PouchDB/CouchDB: Overkill for single-user sync, adds operational complexity
- SQLite via sql.js: Heavy WASM bundle, complicates service worker

### 3. PDF Generation

**Decision**: Client-side with `jspdf` + `jspdf-autotable`

**Rationale**:
- Works offline (no server round-trip needed)
- Small bundle size (~300KB)
- Built-in RTL text support
- Direct download without server processing

**Alternatives Considered**:
- Server-side Puppeteer: Requires server resources, doesn't work offline
- react-pdf: Render-only, not generation
- pdfmake: Larger bundle, less RTL support

### 4. Charting Library

**Decision**: Recharts

**Rationale**:
- React-native components (not canvas-based)
- Excellent responsive/RTL support
- Built-in donut, pie, and bar chart types
- Active maintenance, good TypeScript support
- Smaller bundle than Chart.js for React apps

**Alternatives Considered**:
- Chart.js + react-chartjs-2: Canvas-based (accessibility concerns), larger bundle
- Victory: Good but heavier API surface
- D3.js: Too low-level for this use case

### 5. Database ORM

**Decision**: Prisma

**Rationale**:
- Type-safe database client generated from schema
- Excellent PostgreSQL support
- Built-in migrations
- Works with Next.js API routes seamlessly
- Good developer experience with Prisma Studio

**Alternatives Considered**:
- Drizzle: Newer, less mature ecosystem
- TypeORM: Decorator-heavy, more complex setup
- Raw SQL: Loses type safety, more error-prone

### 6. Authentication (Demo Mode)

**Decision**: Cookie-based session with hardcoded demo user

**Rationale**:
- Simplest implementation for MVP demo mode
- Session cookie persists across browser restarts
- Easy to upgrade to NextAuth.js later
- No OAuth complexity until needed

**Implementation**:
- Single "demo" user in database seeded on first run
- Login endpoint sets HTTP-only session cookie
- Middleware checks cookie, redirects to login if missing
- Future: Replace with NextAuth.js Google provider

**Alternatives Considered**:
- JWT tokens: Overkill for demo mode, complicates refresh logic
- NextAuth.js immediately: Adds OAuth complexity before needed
- No auth: Can't persist user data across sessions

### 7. RTL Implementation

**Decision**: Tailwind CSS `dir="rtl"` + logical properties

**Rationale**:
- Single `dir="rtl"` on root element flips entire layout
- Tailwind's `rtl:` variant for edge cases
- CSS logical properties (`margin-inline-start` vs `margin-left`)
- Hebrew font stack: system-ui falls back correctly

**Implementation**:
- Root layout sets `<html dir="rtl" lang="he">`
- Tailwind config extends with RTL-aware spacing
- Icons that indicate direction (arrows) conditionally flipped

### 8. State Management

**Decision**: React Context + hooks (no Redux/Zustand)

**Rationale**:
- App state is simple: current user, offline queue status, active filters
- Server state handled by React Query (TanStack Query)
- Avoids unnecessary complexity for MVP
- Easy to add Zustand later if needed

**Alternatives Considered**:
- Redux Toolkit: Overkill for this scale
- Zustand: Good option, but Context sufficient initially
- Jotai/Recoil: Atomic state not needed here

### 9. Push Notifications

**Decision**: Web Push API via service worker + scheduled local notifications

**Rationale**:
- PWA can schedule local notifications without server push
- 20:00 daily check runs in service worker
- No push server infrastructure needed for MVP
- Uses Notification API with permission request

**Implementation**:
- Service worker registers periodic sync (if supported) or alarm
- At 20:00, checks IndexedDB for today's transactions
- If none, shows randomized reminder notification
- Falls back to checking on app open if periodic sync unsupported

### 10. Glassmorphism Theme

**Decision**: Tailwind CSS custom utilities + CSS `backdrop-filter`

**Rationale**:
- `backdrop-filter: blur()` creates glass effect
- CSS variables for theme colors (easy dark mode)
- Tailwind plugin for consistent glass card components

**Implementation**:
```css
:root {
  --bg-primary: #0f172a;      /* Deep dark */
  --accent-blue: #38bdf8;     /* Neon sky blue */
  --accent-green: #4ade80;    /* Income green */
  --accent-red: #fb7185;      /* Expense red */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
}
```

## Performance Optimizations

### Database Queries (SC-003: Dashboard < 2s)

- Index on `transactions(user_id, date)` for filtered queries
- Aggregate queries for chart data (avoid fetching all rows)
- Pagination for transaction list (50 items per page)
- Consider materialized views for monthly summaries if needed

### Bundle Size

- Dynamic imports for charts (loaded on dashboard route only)
- PDF library loaded on-demand when export clicked
- Tree-shaking enabled in Next.js production builds
- Target < 200KB initial JS bundle

### Offline Performance

- Service worker caches all app shell assets
- IndexedDB writes are synchronous-feeling (< 50ms)
- Optimistic UI updates before server sync

## Security Considerations

- HTTP-only cookies for session (no XSS token theft)
- CSRF protection via SameSite cookie attribute
- Input validation with Zod schemas
- Prisma parameterized queries (SQL injection safe)
- Content Security Policy headers
- Rate limiting on API routes (100 req/min per IP)

## Resolved Clarifications

All technical context items resolved. No NEEDS CLARIFICATION remaining.
