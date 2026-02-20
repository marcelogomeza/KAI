# ==========================================
# 1. Build Client (React/Vite)
# ==========================================
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# ==========================================
# 2. Build Server (Express)
# ==========================================
FROM node:20-alpine AS server-builder
WORKDIR /app/server

RUN apk add --no-cache openssl

# Cache bust 2
ARG CACHE_BUST=2

COPY server/package*.json ./
RUN npm install

COPY server/ ./
# Generate Prisma Client for TypeScript build
RUN npx prisma generate
# Compile TypeScript to dist/
RUN npx tsc

# ==========================================
# 3. Production Image
# ==========================================
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

# Copy built client
COPY --from=client-builder /app/client/dist ./client/dist

# Copy built server and dependencies
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/prisma ./server/prisma

# Generate Prisma Client in the production image (requires DB connection string at runtime if using real DB, but generation only needs schema)
WORKDIR /app/server
RUN npx prisma generate

# Railway automatically passes PORT
ENV PORT=3000
EXPOSE 3000

CMD ["node", "./dist/src/index.js"]
