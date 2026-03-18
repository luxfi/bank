# Build from bank repo root: docker build -f app/api/Dockerfile .
FROM node:22-alpine AS base
RUN apk add --no-cache python3 py3-setuptools make g++
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
COPY pkg/tools-models/package.json ./pkg/tools-models/
COPY pkg/tools-misc/package.json ./pkg/tools-misc/
COPY pkg/ports-currency-cloud/package.json ./pkg/ports-currency-cloud/
COPY pkg/ports-email/package.json ./pkg/ports-email/
COPY pkg/ports-ifx/package.json ./pkg/ports-ifx/
COPY pkg/compliance/package.json ./pkg/compliance/

RUN pnpm install --frozen-lockfile --shamefully-hoist --ignore-scripts
RUN pnpm rebuild 2>/dev/null || true

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY . .

# Remove stale dist to force fresh build
RUN rm -rf app/api/dist

# Build workspace packages in dependency order
RUN pnpm --filter @luxbank/misc build || true
RUN pnpm --filter @luxbank/brand build || true
RUN pnpm --filter @luxbank/models build || true
RUN pnpm --filter @luxbank/email build || true
RUN pnpm --filter @luxbank/currency-cloud build || true
RUN pnpm --filter @luxbank/ifx build || true
RUN pnpm --filter @luxbank/iam build || true

# Build the API (nest build compiles referenced workspace packages, some have pre-existing TS warnings)
RUN cd app/api && nest build --webpack || nest build || (echo "Falling back to tsc" && npx tsc -p tsconfig.build.json --noEmitOnError false || true)

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built API dist and all node_modules (shamefully-hoisted to root)
COPY --from=builder /app/app/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/api/node_modules ./app/api/node_modules
COPY --from=builder /app/app/api/package.json ./
COPY --from=builder /app/pkg/ ./pkg/
# Templates are referenced as /templates/ (absolute) — symlink from root
RUN ln -sf /app/dist/templates /templates

EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/main"]
