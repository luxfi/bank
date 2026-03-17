# Build from bank repo root: docker build -f app/api/Dockerfile .
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN npm i -g @nestjs/cli

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

RUN pnpm install --frozen-lockfile --shamefully-hoist

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY . .

# Build workspace packages in dependency order
RUN pnpm --filter @luxbank/misc build || true
RUN pnpm --filter @luxbank/brand build || true
RUN pnpm --filter @luxbank/models build || true
RUN pnpm --filter @luxbank/email build || true
RUN pnpm --filter @luxbank/currency-cloud build || true
RUN pnpm --filter @luxbank/ifx build || true
RUN pnpm --filter @luxbank/iam build || true

# Build the API
RUN pnpm --filter @luxbank/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built API dist and all node_modules (shamefully-hoisted to root)
COPY --from=builder /app/app/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/api/node_modules ./app/api/node_modules
COPY --from=builder /app/app/api/package.json ./
COPY --from=builder /app/pkg/ ./pkg/

EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/main"]
