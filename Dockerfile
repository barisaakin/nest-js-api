# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application and seed file
RUN npm run build && \
    npx tsc prisma/seed.ts --esModuleInterop true --target ES2020 --module commonjs

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --only=production

# Copy built app and necessary node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/seed.js ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose the port the app runs on
EXPOSE 5001

# Start the application with migrations and seed
CMD npx prisma migrate deploy && node prisma/seed.js && node dist/src/main.js 