# 1. Dependencias
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Builder
FROM node:22-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline
RUN npx prisma generate

# 3. Runner
FROM node:22-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

# Copiar lo necesario
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Entrypoint para correr migraciones antes de arrancar
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

USER nestjs
EXPOSE 3000

CMD ["./entrypoint.sh"]