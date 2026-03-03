# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/db ./src/db

EXPOSE 4000

# Optionally, you might run migrations here or separately.
CMD npm run db:push && node dist/index.js
