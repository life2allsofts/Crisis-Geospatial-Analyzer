# ============================================
# Ghana Crisis Geospatial Analyzer
# Hugging Face Spaces Dockerfile
# Full-Stack TypeScript Application
# ============================================

# --------------------------------------------
# Build Stage
# --------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
# ✅ ADD Tailwind/PostCSS config files
COPY postcss.config.js ./
COPY tailwind.config.js ./

RUN npm ci

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
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/backend ./backend/
COPY --from=builder /app/frontend ./frontend/

# Copy .env.example as .env (will be overridden by HF secrets)
COPY .env.example .env

# Install production dependencies only
RUN npm ci --production --ignore-scripts

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

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