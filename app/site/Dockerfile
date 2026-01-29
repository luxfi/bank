# Build from bank repo root to access workspace packages
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY pkg/brand/package.json ./pkg/brand/
COPY app/site/package.json ./app/site/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pkg/brand/node_modules ./pkg/brand/node_modules
COPY --from=deps /app/app/site/node_modules ./app/site/node_modules
COPY . .

# Build brand package first
RUN pnpm --filter @luxbank/brand build

# Build the site
RUN pnpm --filter @luxbank/site build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/app/site/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/app/site/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/site/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
