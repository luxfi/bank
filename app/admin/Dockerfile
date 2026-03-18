# Build from bank repo root: docker build -f app/admin/Dockerfile .
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

# Build dependencies
RUN pnpm --filter @luxbank/brand build || true
RUN pnpm --filter @luxbank/ui build || true

# Increase memory for CRA build
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Build the admin dashboard (CRA / react-scripts)
ENV GENERATE_SOURCEMAP=false
ENV SKIP_PREFLIGHT_CHECK=true
ENV DISABLE_ESLINT_PLUGIN=true
# react-scripts is hoisted to root node_modules; ensure the local symlink resolves
RUN ln -sf /app/node_modules/react-scripts /app/app/admin/node_modules/react-scripts 2>/dev/null; \
    cd app/admin && NODE_PATH=/app/node_modules /app/node_modules/.bin/react-scripts build || true
# Verify build directory exists
RUN test -d app/admin/build/static || (echo "Admin build failed" && exit 1)

FROM node:22-alpine AS runner
RUN npm i -g serve
WORKDIR /app

COPY --from=builder /app/app/admin/build ./build

EXPOSE 3000
ENV PORT=3000
CMD ["serve", "-s", "build", "-l", "3000"]
