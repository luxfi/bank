FROM golang:1.26.3-alpine AS builder

RUN apk add --no-cache gcc musl-dev

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
