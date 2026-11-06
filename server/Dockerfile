FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built files
COPY --from=builder /app/dist ./dist

# Install sharp for image processing (native binaries)
RUN npm install sharp

# Create data directory
RUN mkdir -p /data/uploads

EXPOSE 3000

CMD ["node", "dist/index.js"]
