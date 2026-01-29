# Build from bank repo root to access workspace packages
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY pkg/brand/package.json ./pkg/brand/
COPY pkg/ui/package.json ./pkg/ui/
COPY app/dash/package.json ./app/dash/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pkg/brand/node_modules ./pkg/brand/node_modules
COPY --from=deps /app/pkg/ui/node_modules ./pkg/ui/node_modules
COPY --from=deps /app/app/dash/node_modules ./app/dash/node_modules
COPY . .

# Build dependencies
RUN pnpm --filter @luxbank/brand build
RUN pnpm --filter @luxbank/ui build

# Build the dashboard
RUN pnpm --filter @luxbank/dash build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/app/dash/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/app/dash/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/dash/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
