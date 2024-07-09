FROM node:18-alpine as builder

WORKDIR /app-cdax

COPY package.json package-lock.json .npmrc ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine as runner

WORKDIR /app-cdax

COPY --from=builder /app-cdax/package.json .
COPY --from=builder /app-cdax/package-lock.json .
COPY --from=builder /app-cdax/next.config.js ./
COPY --from=builder /app-cdax/public ./public
COPY --from=builder /app-cdax/.next/standalone ./
COPY --from=builder /app-cdax/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["npm", "start"]