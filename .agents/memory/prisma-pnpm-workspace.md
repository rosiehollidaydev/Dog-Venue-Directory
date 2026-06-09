---
name: Prisma in pnpm workspace
description: Prisma build scripts are blocked by default in pnpm workspace; must be explicitly approved or run via npx directly.
---

**Rule:** After any fresh `pnpm install` in this workspace, Prisma build scripts are ignored with a warning: "Ignored build scripts: @prisma/client, @prisma/engines, prisma, sharp." The Prisma client will not be generated automatically.

**Why:** The workspace has `onlyBuiltDependencies` restrictions and the build approval flow blocks postinstall scripts by default.

**How to apply:**
- Run `pnpm approve-builds` to whitelist Prisma (interactive), OR
- Run `cd artifacts/newcastle-dog && npx prisma generate` directly as a reliable fallback
- For migrations: `cd artifacts/newcastle-dog && npx prisma migrate dev --name <name>`
- For seeding: `cd artifacts/newcastle-dog && npx tsx prisma/seed.ts`
