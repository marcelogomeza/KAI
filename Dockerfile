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

RUN apk add --no-cache openssl libc6-compat

# Copy built client
COPY --from=client-builder /app/client/dist ./client/dist

# Copy built server and all its structure
WORKDIR /app/server
COPY --from=server-builder /app/server ./

# Generate Prisma Client in the production image to ensure compatibility
RUN npx prisma generate

CMD ["node", "dist/index.js"]
