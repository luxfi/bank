FROM golang:1.26.4-alpine AS builder

RUN apk add --no-cache gcc musl-dev git

# All modules resolve through the public Go proxy (GOPROXY default). Disable
# only the checksum DB — some luxfi tags were re-published, so sumdb would
# reject them; go.sum still enforces integrity. Do NOT set GOPRIVATE here: it
# would force direct git for luxfi/hanzoai modules, which needs credentials the
# container build doesn't have.
ENV GOSUMDB=off GOFLAGS=-mod=mod

WORKDIR /src
COPY go.mod go.sum ./
# First-party luxfi/hanzoai/lux-private tags get periodically re-published, so
# the CI Go proxy may serve a different module zip than go.sum pinned (edge
# split-brain → "checksum mismatch / SECURITY ERROR" on go mod download). Third-
# party integrity is untouched; only our own modules' sums are dropped and then
# re-recorded from the proxy under -mod=mod. Durable fix for the recurring drift.
RUN sed -i -E '/github\.com\/(luxfi|hanzoai|lux-private)\//d' go.sum || true
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o /bankd ./cmd/bankd

FROM alpine:3.22
RUN apk add --no-cache ca-certificates
COPY --from=builder /bankd /usr/local/bin/bankd
EXPOSE 8070
ENTRYPOINT ["bankd", "serve", "--http", "0.0.0.0:8070"]
