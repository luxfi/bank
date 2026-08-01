# Lux Financial customer dashboard (@luxfi/bank-dash).
#
# Stage 1 builds the Vite SPA. Stage 2 builds the tiny stdlib static+proxy
# server (dashd) that serves it and forwards /v1 to bankd — no nginx/caddy.

# ---- web build ----
# Node 22: corepack pulls the latest pnpm, which requires the node:sqlite
# built-in (absent on Node 20).
FROM node:22-alpine AS web
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- server build ----
FROM golang:1.26.5-alpine AS srv
ENV GOTOOLCHAIN=auto
WORKDIR /src
COPY server/go.mod ./
RUN go mod download
COPY server/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /dashd .

# ---- runtime ----
FROM alpine:3.22
RUN apk add --no-cache ca-certificates
COPY --from=srv /dashd /usr/local/bin/dashd
COPY --from=web /app/dist /app/dist
ENV DIST_DIR=/app/dist PORT=3000
EXPOSE 3000
ENTRYPOINT ["dashd"]
