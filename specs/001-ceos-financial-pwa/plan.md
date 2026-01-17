# Implementation Plan: CEOs Financial Management PWA

**Branch**: `001-ceos-financial-pwa` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ceos-financial-pwa/spec.md`

## Summary

Build a Hebrew RTL Progressive Web App for young adults (17-23) to track personal finances. Core features include fast expense/income entry, customizable categories with soft-delete, visual analytics dashboards (donut charts, pie charts, bar charts), PDF export, and offline-first architecture with last-write-wins sync. Single currency (ILS/₪), dark glassmorphism theme, demo-mode authentication for MVP.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend & Backend)
**Primary Dependencies**:
- Frontend: Next.js 14+ (App Router), React 18+, Tailwind CSS 3.x, Framer Motion, Recharts
- Backend: Node.js 20 LTS, Express.js 4.x, Prisma ORM
- PWA: next-pwa, Workbox for service worker
**Storage**: PostgreSQL 15+ (production), SQLite (local dev optional)
**Testing**: Jest + React Testing Library (frontend), Jest + Supertest (backend)
**Target Platform**: Mobile-first PWA (Chrome 90+, Safari 14+, Edge 90+), responsive desktop
**Project Type**: Web application (monorepo with frontend + backend)
**Performance Goals**:
- Dashboard load < 2s for 5 years of data
- Transaction entry < 15s user flow
- PDF export < 5s
**Constraints**:
- Offline-capable (IndexedDB for local queue)
- RTL layout throughout
- < 3s PWA launch from home screen
**Scale/Scope**: 10,000 users, 5 years daily transactions each (~18M transactions total)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS (No project constitution defined - using standard best practices)

The constitution file contains template placeholders. For this greenfield project, we will follow:
- Test coverage for critical paths (auth, transactions, sync)
- Clean separation of concerns (API routes, services, data access)
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA for RTL)

## Project Structure

### Documentation (this feature)

```text
specs/001-ceos-financial-pwa/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Auth routes (login)
│   ├── (main)/              # Protected routes
│   │   ├── page.tsx         # Home (balance + quick actions)
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── transactions/    # Transaction list/edit
│   │   └── settings/        # Category management
│   ├── api/                 # API routes (Next.js API)
│   │   ├── auth/
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── export/
│   ├── layout.tsx           # Root layout (RTL, theme)
│   └── globals.css          # Tailwind + theme variables
├── components/
│   ├── ui/                  # Reusable UI (buttons, cards, inputs)
│   ├── charts/              # Donut, Pie, Bar chart wrappers
│   ├── forms/               # Transaction entry forms
│   └── layout/              # Navigation, headers
├── lib/
│   ├── db/                  # Prisma client, schema
│   ├── auth/                # Demo auth logic
│   ├── sync/                # Offline queue + sync service
│   └── pdf/                 # PDF generation
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript interfaces
└── utils/                   # Helpers (formatting, validation)

prisma/
├── schema.prisma            # Database schema
└── migrations/              # Migration files

public/
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker (generated)
└── icons/                   # PWA icons

tests/
├── unit/                    # Unit tests
├── integration/             # API integration tests
└── e2e/                     # Playwright E2E tests
```

**Structure Decision**: Next.js monorepo with API routes (no separate backend server). This simplifies deployment, enables server components for performance, and reduces infrastructure complexity for an MVP. The `/api` routes handle all backend logic with Prisma for database access.

## Complexity Tracking

No constitution violations to justify - standard web app architecture selected.
