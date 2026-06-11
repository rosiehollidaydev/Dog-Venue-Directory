#!/bin/sh
set -e

echo "[newcastle.dog] Running Prisma migrations..."
prisma migrate deploy --schema=/app/artifacts/newcastle-dog/prisma/schema.prisma

echo "[newcastle.dog] Starting Next.js on port ${PORT:-3000}..."
exec node /app/artifacts/newcastle-dog/server.js
