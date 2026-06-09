# Newcastle.dog — Dog-Friendly Venue Directory

A production-ready dog-friendly venue directory starting with Newcastle upon Tyne, built for multi-city expansion.

## Run & Operate

- `pnpm --filter @workspace/newcastle-dog run dev` — run the Next.js app (port 3000)
- `pnpm --filter @workspace/newcastle-dog run db:migrate` — run Prisma migrations
- `pnpm --filter @workspace/newcastle-dog run db:seed` — seed 106 venues (6 named + 100 generated)
- `pnpm --filter @workspace/newcastle-dog run db:studio` — open Prisma Studio
- `pnpm --filter @workspace/api-server run dev` — run the Express API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — min 32 chars

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Newcastle.dog**: Next.js 15.5 (App Router), Tailwind CSS v3, Prisma 5, iron-session auth
- **API Server**: Express 5, Drizzle ORM (separate artifact)
- DB: PostgreSQL (shared by both)
- Build: Next.js (newcastle-dog), esbuild (api-server)

## Where things live

- `artifacts/newcastle-dog/` — the main dog directory app (`@workspace/newcastle-dog`)
- `artifacts/api-server/` — Express API server (`@workspace/api-server`)
- `artifacts/newcastle-dog/prisma/schema.prisma` — DB schema source of truth
- `artifacts/newcastle-dog/src/lib/actions.ts` — all server actions
- `artifacts/newcastle-dog/src/lib/session.ts` — iron-session config
- `artifacts/newcastle-dog/src/middleware.ts` — admin route protection
- `artifacts/newcastle-dog/prisma/seed.ts` — 106 venue seed

## Architecture decisions

- **Next.js App Router only** — no `/api/*` routes (would conflict with Express api-server at `/api`). All data via Server Components + Server Actions only.
- **No NextAuth** — iron-session used directly. Simpler, no OAuth complexity.
- **Multi-city from day one** — City → Area → Venue hierarchy in Prisma schema supports expansion to Leeds, Durham, etc.
- **Admin separate from public** — `/admin/*` routes are middleware-protected; admin layout hides sidebar when unauthenticated.
- **Next.js 15 + React 19** — upgraded from planned Next.js 14 because the package firewall blocked 14.2.21 (< 1 day old). v15 works cleanly with catalog's React 19.1.0.

## Product

- Public: homepage, venue listing (paginated, searchable, filterable), venue detail pages, city/area/category pages
- Admin back office: full venue CRUD, cities/areas/categories/amenities management, review moderation, claim requests, featured listings, affiliate links
- 106 seeded venues across 7 Newcastle areas (Quayside, Jesmond, Ouseburn, Gosforth, Heaton, City Centre, Tynemouth)

## Seed admin credentials

- Email: `admin@newcastle.dog`
- Password: `admin123`
- **Change these after first login!**

## Brand palette

- Charcoal `#41463D` · Lavender `#9D8DF1` · Ice Blue `#B8CDF8` · Mint `#95F2D9` · Neon Mint `#1CFEBA`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **No API routes in newcastle-dog**: the Express api-server owns `/api/*`. Never add `/api/*` routes to the Next.js app.
- **Prisma build approval**: after fresh `pnpm install`, run `pnpm approve-builds` or Prisma won't generate. Use `cd artifacts/newcastle-dog && npx prisma generate` as fallback.
- **Package firewall**: minimum release age is 1440 mins. Very new packages (e.g. Next.js 14.2.21 on day of release) will be blocked with 403. Pin to versions that are at least 1 day old.
- **Tailwind v3 globals.css**: `@import` must come BEFORE `@tailwind base/components/utilities`.
- **Next.js 15 serverActions**: moved from `experimental.serverActions` to top-level `serverActions` in next.config.ts.
- **Iron-session in middleware**: middleware.ts cannot import from `@/lib/session` (which imports `next/headers`). Session options are inlined directly in middleware.ts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Newcastle.dog artifact not formally registered via createArtifact (directory existed); artifact.toml written via bash; workflow registered manually via configureWorkflow.
