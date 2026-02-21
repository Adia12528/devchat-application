# Backend Dockerfile for production
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle graceful shutdowns
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
USER appuser

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => {if (res.statusCode !== 200) throw new Error(res.statusCode)})"

# Use dumb-init to properly handle signals
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start application
CMD ["node", "server.js"]
