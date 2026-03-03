# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Force rebuild to reflect login and roles changes
ARG CACHE_BUST=2026-03-03-02

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets to NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
