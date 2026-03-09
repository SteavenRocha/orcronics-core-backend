# 1. Dependencias
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Constructor (Builder)
FROM node:22-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
# Instalamos solo dependencias de producción para el runner final
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# 3. Ejecución (Runner)
FROM node:22-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Crear usuario de sistema para no correr como root
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
USER nestjs

# Copiar solo lo estrictamente necesario
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]