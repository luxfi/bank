FROM node:18-alpine as builder

WORKDIR /app-lux

COPY package.json package-lock.json .npmrc ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine as runner

WORKDIR /app-lux

COPY --from=builder /app-lux/package.json .
COPY --from=builder /app-lux/package-lock.json .
COPY --from=builder /app-lux/next.config.js ./
COPY --from=builder /app-lux/public ./public
COPY --from=builder /app-lux/.next/standalone ./
COPY --from=builder /app-lux/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["npm", "start"]