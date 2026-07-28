# Dependency stage
FROM node:26-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# CI stage
FROM deps AS ci
COPY . .
ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL
RUN npm run type-check \
 && npm run type-check:server \
 && npm test -- --ci \
 && npm run build \
 && npm run build:server

# Production dependency stage
FROM ci AS production-deps
RUN npm prune --omit=dev

# Run stage
FROM node:26-slim AS runtime
WORKDIR /app
COPY package*.json ./
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=ci /app/dist ./dist
COPY --from=ci /app/dist-server ./dist-server
EXPOSE 3000
CMD ["node", "dist-server/server/index.js"]
