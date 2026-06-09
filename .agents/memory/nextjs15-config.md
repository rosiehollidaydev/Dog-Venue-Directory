---
name: Next.js 15 config changes
description: Key breaking changes in Next.js 15 config vs 14 — serverActions and React 19.
---

**Rules:**

1. `serverActions` config moved from `experimental.serverActions` to top-level in `next.config.ts`:
   ```ts
   // Next.js 14 (old)
   experimental: { serverActions: { allowedOrigins: ["*"] } }
   // Next.js 15 (correct)
   serverActions: { allowedOrigins: ["*"] }
   ```

2. Next.js 15 requires React 19. The workspace catalog pins `react: 19.1.0` and `react-dom: 19.1.0`. Use these exact versions in `package.json` to avoid peer dep conflicts.

3. `@types/react` and `@types/react-dom` should be `^19.0.0` for Next.js 15.

**Why:** Next.js 15 was a major version that graduated several experimental features and tightened the React version requirement.
