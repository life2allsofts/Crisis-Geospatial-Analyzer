# ============================================
# Ghana Crisis Geospatial Analyzer
# Hugging Face Spaces Dockerfile
# Full-Stack TypeScript Application
# ============================================

# --------------------------------------------
# Build Stage
# --------------------------------------------
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install dependencies (package*.json captures both package.json and package-lock.json)
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# npm ci fails with cross-platform optional deps (npm/cli#4828)
# npm install respects the lockfile AND resolves current platform's optional deps
RUN npm install --include=optional && \
    npm install --no-save --force @tailwindcss/oxide-linux-x64-gnu

# Verify binding before build
RUN node -e "require('@tailwindcss/oxide')" && echo "✅ Oxide binding verified"

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY index.html ./
COPY server.ts ./

# Build the application
RUN npm run build

# --------------------------------------------
# Production Stage
# --------------------------------------------
FROM node:20-bookworm-slim

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/backend ./backend/
COPY --from=builder /app/frontend ./frontend/

# Copy .env.example as .env (will be overridden by runtime secrets)
COPY .env.example .env

# Install production dependencies only
RUN npm install --production --ignore-scripts

# Create non-root user
RUN useradd -m -u 1001 nodejs

USER nodejs

# --------------------------------------------
# Environment
# --------------------------------------------
ENV NODE_ENV=production
ENV PORT=7860

# --------------------------------------------
# Expose Hugging Face Spaces port
# --------------------------------------------
EXPOSE 7860

# --------------------------------------------
# Health check
# --------------------------------------------
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:7860/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# --------------------------------------------
# Start application
# --------------------------------------------
CMD ["node", "dist/server.cjs"]