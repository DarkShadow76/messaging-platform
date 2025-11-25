# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install all dependencies for building
COPY message-api/package*.json ./
RUN npm install

# Copy the rest of the source code
COPY message-api/ .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY message-api/package*.json ./
RUN npm ci --only=production

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
