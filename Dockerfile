# Multi-stage build for code-talk React client

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Build argument for API URL
ARG REACT_APP_GRAPHQL_HTTP_URI
ARG REACT_APP_GRAPHQL_WS_URI
ENV REACT_APP_GRAPHQL_HTTP_URI=$REACT_APP_GRAPHQL_HTTP_URI
ENV REACT_APP_GRAPHQL_WS_URI=$REACT_APP_GRAPHQL_WS_URI

# Disable ESLint warnings as errors (CI=false prevents treating warnings as errors)
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only express (needed for server.js)
RUN npm install express --production && \
    npm cache clean --force

# Copy server.js and build artifacts
COPY server.js ./
COPY --from=build /app/build ./build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:5000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start production server
CMD ["npm", "start"]

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
