# Build from bank repo root to access workspace packages
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY pkg/brand/package.json ./pkg/brand/
COPY pkg/models/package.json ./pkg/models/
COPY pkg/email/package.json ./pkg/email/
COPY pkg/currency-cloud/package.json ./pkg/currency-cloud/
COPY pkg/ifx/package.json ./pkg/ifx/
COPY pkg/iam/package.json ./pkg/iam/
COPY app/api/package.json ./app/api/

# Install dependencies (include devDeps for nest CLI)
RUN pnpm install --frozen-lockfile
RUN pnpm add -g @nestjs/cli

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pkg/brand/node_modules ./pkg/brand/node_modules
COPY --from=deps /app/pkg/models/node_modules ./pkg/models/node_modules
COPY --from=deps /app/pkg/email/node_modules ./pkg/email/node_modules
COPY --from=deps /app/pkg/currency-cloud/node_modules ./pkg/currency-cloud/node_modules
COPY --from=deps /app/pkg/ifx/node_modules ./pkg/ifx/node_modules
COPY --from=deps /app/pkg/iam/node_modules ./pkg/iam/node_modules
COPY --from=deps /app/app/api/node_modules ./app/api/node_modules
COPY . .

# Build workspace packages
RUN pnpm --filter @luxbank/brand build
RUN pnpm --filter @luxbank/models build
RUN pnpm --filter @luxbank/email build
RUN pnpm --filter @luxbank/currency-cloud build
RUN pnpm --filter @luxbank/ifx build
RUN pnpm --filter @luxbank/iam build

# Build the API
RUN pnpm --filter @luxbank/api build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/app/api/dist ./dist
COPY --from=builder /app/app/api/node_modules ./node_modules
COPY --from=builder /app/app/api/package.json ./

EXPOSE 4000

ENV PORT=4000

CMD ["node", "dist/main"]
