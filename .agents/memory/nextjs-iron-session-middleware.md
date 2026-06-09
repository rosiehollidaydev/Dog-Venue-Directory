---
name: Next.js + iron-session middleware
description: Iron-session cannot be imported from a shared session.ts file into Next.js middleware — inline the options directly.
---

**Rule:** `src/middleware.ts` must NOT import from `@/lib/session` (or any file that imports `next/headers`). The Edge Runtime where middleware runs does not support `next/headers`.

**Why:** `next/headers` is a Node.js runtime API. Middleware runs in the Edge Runtime. Importing any module that transitively imports `next/headers` causes a runtime error at startup.

**How to apply:** In `middleware.ts`, inline the `sessionOptions` object directly (copy password, cookieName, cookieOptions). Only import `getIronSession` from `iron-session` and the `SessionData` interface (type-only import is fine). Call `getIronSession(request, response, inlinedOptions)`.
