FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY artifacts/newcastle-dog/package.json ./artifacts/newcastle-dog/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --no-frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY artifacts/newcastle-dog/package.json ./artifacts/newcastle-dog/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/
COPY tsconfig.base.json tsconfig.json ./

COPY artifacts/newcastle-dog/ ./artifacts/newcastle-dog/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --no-frozen-lockfile

RUN pnpm --filter @workspace/newcastle-dog db:generate

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm --filter @workspace/newcastle-dog run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update -qq && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/artifacts/newcastle-dog/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/artifacts/newcastle-dog/.next/static ./artifacts/newcastle-dog/.next/static

COPY --from=builder --chown=nextjs:nodejs /app/artifacts/newcastle-dog/public ./artifacts/newcastle-dog/public

COPY --from=builder --chown=nextjs:nodejs /app/artifacts/newcastle-dog/prisma ./artifacts/newcastle-dog/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
