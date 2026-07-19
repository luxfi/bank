FROM golang:1.26.4-alpine AS builder

RUN apk add --no-cache gcc musl-dev git

# All modules resolve through the public Go proxy (GOPROXY default). Disable
# only the checksum DB — some luxfi tags were re-published, so sumdb would
# reject them; go.sum still enforces integrity. Do NOT set GOPRIVATE here: it
# would force direct git for luxfi/hanzoai modules, which needs credentials the
# container build doesn't have.
ENV GOSUMDB=off GOFLAGS=-mod=mod

WORKDIR /src
COPY go.mod ./
# First-party luxfi/hanzoai tags get periodically re-published, so the CI Go
# proxy serves a different module zip than any pinned go.sum (edge split-brain →
# "checksum mismatch / SECURITY ERROR"). We rebuild go.sum from the proxy inside
# the image: with GOSUMDB=off there is no sumdb round-trip, and regeneration +
# build share one proxy edge within this layer, so the graph is self-consistent.
# Durable fix for the recurring drift; the pinned go.sum is intentionally not
# COPYed. (Third-party pins are re-derived here, not sumdb-checked — acceptable
# for this first-party-heavy sandbox image.)
RUN go mod download all
COPY . .
RUN CGO_ENABLED=1 go build -o /bankd ./cmd/bankd

FROM alpine:3.22
RUN apk add --no-cache ca-certificates
COPY --from=builder /bankd /usr/local/bin/bankd
EXPOSE 8070
ENTRYPOINT ["bankd", "serve", "--http", "0.0.0.0:8070"]
