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
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o /bankd ./cmd/bankd

FROM alpine:3.22
RUN apk add --no-cache ca-certificates
COPY --from=builder /bankd /usr/local/bin/bankd
EXPOSE 8070
ENTRYPOINT ["bankd", "serve", "--http", "0.0.0.0:8070"]
