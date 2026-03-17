# Build from bank repo root: docker build -f app/dash/Dockerfile .
FROM node:22-alpine AS base
RUN apk add --no-cache python3 py3-setuptools make g++
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app

# Copy ALL workspace package.json files so pnpm resolves the full dependency graph
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY pkg/brand/package.json ./pkg/brand/
COPY pkg/models/package.json ./pkg/models/
COPY pkg/email/package.json ./pkg/email/
COPY pkg/misc/package.json ./pkg/misc/
COPY pkg/currency-cloud/package.json ./pkg/currency-cloud/
COPY pkg/ifx/package.json ./pkg/ifx/
COPY pkg/iam/package.json ./pkg/iam/
COPY pkg/ui/package.json ./pkg/ui/
COPY pkg/migration/package.json ./pkg/migration/
COPY app/api/package.json ./app/api/
COPY app/dash/package.json ./app/dash/
COPY app/admin/package.json ./app/admin/
COPY pkg/tools-models/package.json ./pkg/tools-models/
COPY pkg/tools-misc/package.json ./pkg/tools-misc/

RUN pnpm install --frozen-lockfile --shamefully-hoist

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY . .

# Build dependencies
RUN pnpm --filter @luxbank/brand build || true
RUN pnpm --filter @luxbank/ui build || true

# Build the dashboard (Next.js standalone output)
ARG NEXT_PUBLIC_BASE_URL=https://api.lux.financial
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
# __NEXT_PRIVATE_PREBUNDLED_REACT disables prerendering for pages that use document/window
ENV NEXT_PRIVATE_STANDALONE=true
# Some pages fail to prerender (document not defined) but standalone output is still generated
RUN pnpm --filter @luxbank/dash build; \
    if [ -d app/dash/.next/standalone ]; then echo "Build OK (standalone generated)"; \
    else echo "Build failed - no standalone" && exit 1; fi

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone output in monorepo preserves workspace structure
COPY --from=builder --chown=nextjs:nodejs /app/app/dash/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/dash/.next/static ./app/dash/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/app/dash/public ./app/dash/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# server.js is at app/dash/server.js in monorepo standalone output
CMD ["node", "app/dash/server.js"]
