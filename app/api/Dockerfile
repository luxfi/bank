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
COPY pkg/misc/package.json ./pkg/misc/
COPY pkg/currency-cloud/package.json ./pkg/currency-cloud/
COPY pkg/ifx/package.json ./pkg/ifx/
COPY pkg/iam/package.json ./pkg/iam/
COPY app/api/package.json ./app/api/

# Install all dependencies (including devDeps for build tools)
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

# Install nest CLI globally for build
RUN npm i -g @nestjs/cli

# Copy all node_modules from deps
COPY --from=deps /app/ ./

# Copy source code
COPY . .

# Build workspace packages in dependency order
RUN pnpm --filter @luxbank/misc build || true
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

# Copy built artifacts and all workspace node_modules
COPY --from=builder /app/app/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/api/node_modules ./app/api/node_modules
COPY --from=builder /app/app/api/package.json ./
COPY --from=builder /app/pkg/ ./pkg/

EXPOSE 4000

ENV PORT=4000

CMD ["node", "dist/main"]
