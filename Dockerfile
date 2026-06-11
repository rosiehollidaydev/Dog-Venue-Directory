# ============================================================
# Newcastle.dog — Production Dockerfile
# Uses node:20-slim (Debian/glibc) throughout — required
# because pnpm-workspace.yaml strips musl binaries.
# ============================================================

# ---- base ----
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- deps: install workspace dependencies ----
FROM base AS deps
WORKDIR /app

# Workspace root config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Every workspace package.json must be present so pnpm can
# resolve the full graph — only these files, no source yet.
COPY artifacts/newcastle-dog/package.json ./artifacts/newcastle-dog/
COPY artifacts/api-server/package.json    ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/api-client-react/package.json    ./lib/api-client-react/
COPY lib/api-spec/package.json            ./lib/api-spec/
COPY lib/api-zod/package.json             ./lib/api-zod/
COPY lib/db/package.json                  ./lib/db/
COPY scripts/package.json                 ./scripts/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- builder: compile the app ----
FROM base AS builder
WORKDIR /app

# Re-declare workspace config (needed by pnpm at build time)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY artifacts/newcastle-dog/package.json ./artifacts/newcastle-dog/
COPY artifacts/api-server/package.json    ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/api-client-react/package.json    ./lib/api-client-react/
COPY lib/api-spec/package.json            ./lib/api-spec/
COPY lib/api-zod/package.json             ./lib/api-zod/
COPY lib/db/package.json                  ./lib/db/
COPY scripts/package.json                 ./scripts/
COPY tsconfig.base.json tsconfig.json ./

# Bring in node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# App source
COPY artifacts/newcastle-dog/ ./artifacts/newcastle-dog/

# Generate Prisma client (schema-only, no DB connection required)
RUN cd artifacts/newcastle-dog && npx prisma generate

# Build Next.js (no DB connection needed — all public pages with
# Prisma queries are marked force-dynamic)
RUN pnpm --filter @workspace/newcastle-dog run build

# ---- runner: minimal production image ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# openssl is required by the Prisma query engine
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Install Prisma CLI for running migrate deploy at startup.
# Scripts must run so the migration engine binary is downloaded.
RUN npm install -g prisma@5

# Standalone bundle (includes only required runtime node_modules)
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/.next/standalone ./

# Static assets (not bundled in standalone)
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/.next/static \
     ./artifacts/newcastle-dog/.next/static

# Public folder
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/public \
     ./artifacts/newcastle-dog/public

# Prisma schema + migrations (needed by migrate deploy)
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/prisma \
     ./artifacts/newcastle-dog/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
