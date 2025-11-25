# Production Dockerfile for Next.js app (Node 20)
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN apk add --no-cache libc6-compat python3 build-base git
RUN npm ci --production

# Copy source
COPY . .

# Build
RUN npm run build

# Use a smaller image for runtime
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built output and node_modules from builder
COPY --from=base /usr/src/app/.next ./.next
COPY --from=base /usr/src/app/public ./public
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json

# Expose port used by Next
EXPOSE 3000

# Start the Next server
CMD ["node", ".next/standalone/server.js"]
# Use Node.js LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]