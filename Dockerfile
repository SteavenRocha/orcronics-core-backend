# 1. Dependencias
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@4.13.0 --activate
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile

# 2. Builder
FROM node:22-alpine3.20 AS builder
RUN corepack enable && corepack prepare yarn@4.13.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN npx prisma generate

# 3. Runner
FROM node:22-alpine3.20 AS runner
RUN apk add --no-cache su-exec
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