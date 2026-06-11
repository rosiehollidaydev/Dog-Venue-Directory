# ============================================================
# Newcastle.dog — Production Dockerfile
# Builds the Next.js app from the pnpm monorepo using the
# Next.js standalone output for a minimal production image.
# ============================================================

# ---- base: shared node + pnpm setup ----
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- deps: install all workspace dependencies ----
FROM base AS deps
WORKDIR /app

# Copy workspace root config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy every workspace package.json so pnpm can resolve the full graph.
# Only these files are needed at install time — source is copied later.
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

# Bring in installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all package.json files again (needed by pnpm at build time)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY artifacts/newcastle-dog/package.json ./artifacts/newcastle-dog/
COPY artifacts/api-server/package.json    ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/api-client-react/package.json    ./lib/api-client-react/
COPY lib/api-spec/package.json            ./lib/api-spec/
COPY lib/api-zod/package.json             ./lib/api-zod/
COPY lib/db/package.json                  ./lib/db/
COPY scripts/package.json                 ./scripts/

# Copy source — only what the Next.js build needs
COPY tsconfig.base.json tsconfig.json ./
COPY artifacts/newcastle-dog/ ./artifacts/newcastle-dog/

# Generate Prisma client (schema only — no DB connection required)
RUN cd artifacts/newcastle-dog && npx prisma generate

# Build Next.js (produces .next/standalone)
RUN pnpm --filter @workspace/newcastle-dog run build

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Install Prisma CLI for running migrations at container startup
RUN npm install -g prisma@5 --ignore-scripts

# Copy the standalone bundle (includes only required node_modules)
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/.next/standalone ./

# Copy static assets (not bundled in standalone)
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/.next/static \
     ./artifacts/newcastle-dog/.next/static

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/public \
     ./artifacts/newcastle-dog/public

# Copy Prisma schema so migrate deploy can run at startup
COPY --from=builder --chown=nextjs:nodejs \
     /app/artifacts/newcastle-dog/prisma \
     ./artifacts/newcastle-dog/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
