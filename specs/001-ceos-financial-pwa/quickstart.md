# Quickstart: CEOs Financial Management PWA

**Date**: 2026-01-15
**Feature**: 001-ceos-financial-pwa

## Prerequisites

- Node.js 20 LTS or later
- PostgreSQL 15+ (or Docker for local development)
- pnpm (recommended) or npm

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project root
cd mankal

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create `.env.local` in the project root:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ceos_dev"

# Session (generate with: openssl rand -base64 32)
SESSION_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name ceos-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Create database
docker exec -it ceos-postgres psql -U postgres -c "CREATE DATABASE ceos_dev;"

# Run migrations
pnpm prisma migrate dev

# Seed demo user and default categories
pnpm prisma db seed
```

### 4. Start Development Server

```bash
pnpm dev
```

App will be available at `http://localhost:3000`

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm prisma studio` | Open Prisma database GUI |
| `pnpm prisma migrate dev` | Create and run migrations |

## Project Structure Quick Reference

```
src/
├── app/              # Next.js pages and API routes
│   ├── (auth)/       # Login page
│   ├── (main)/       # Protected pages (home, dashboard, settings)
│   └── api/          # Backend API endpoints
├── components/       # React components
│   ├── ui/           # Buttons, cards, inputs
│   ├── charts/       # Recharts wrappers
│   └── forms/        # Transaction entry forms
├── lib/              # Core libraries
│   ├── db/           # Prisma client
│   ├── auth/         # Session management
│   └── sync/         # Offline queue
└── types/            # TypeScript interfaces
```

## Key Files to Understand

1. **`prisma/schema.prisma`** - Database schema definition
2. **`src/app/layout.tsx`** - Root layout with RTL and dark theme
3. **`src/lib/auth/session.ts`** - Demo authentication logic
4. **`src/lib/sync/offline-queue.ts`** - IndexedDB offline queue
5. **`src/app/api/transactions/route.ts`** - Transaction CRUD API

## Testing the App

### Manual Testing Flow

1. Open `http://localhost:3000`
2. Click "Sign in with Google" (demo mode - instant access)
3. Add an expense: tap + expense, enter 50, select "Food", choose "Card"
4. Add income: tap + income, enter 1000, enter "Salary"
5. View dashboard: see donut chart, net balance
6. Export PDF: click export button

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests (requires dev server running)
pnpm test:e2e

# Test coverage
pnpm test --coverage
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create route file in `src/app/api/[route]/route.ts`
2. Add Zod schema for validation in `src/types/schemas/`
3. Implement handler using Prisma client
4. Add tests in `tests/integration/`

### Adding a New Component

1. Create component in `src/components/[category]/`
2. Use Tailwind + glassmorphism utilities
3. Ensure RTL compatibility (use logical properties)
4. Add unit tests in `tests/unit/components/`

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name describe_change`
3. Update TypeScript types if needed
4. Update API handlers and tests

## Offline Development

To test offline functionality:

1. Open Chrome DevTools > Network tab
2. Select "Offline" in throttling dropdown
3. Create/edit transactions (queued in IndexedDB)
4. Go back online
5. Verify sync completes (check network requests)

## Debugging Tips

### Database Issues
```bash
# Reset database completely
pnpm prisma migrate reset

# View database in GUI
pnpm prisma studio
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules && pnpm install
```

### Service Worker Issues
```bash
# In browser DevTools > Application > Service Workers
# Click "Unregister" to clear stale worker
```

## Deployment Checklist

1. Set production environment variables
2. Run `pnpm build` to verify no errors
3. Run database migrations on production
4. Configure HTTPS (required for PWA)
5. Test PWA installation on mobile device
