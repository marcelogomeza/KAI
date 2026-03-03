# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json drizzle.config.ts ./
COPY src/ ./src/

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./

EXPOSE 4000

# Optionally, you might run migrations here or separately.
CMD npm run db:push && node dist/index.js
