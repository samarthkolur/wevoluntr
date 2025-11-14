# Builder — must use Node 20+
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Production Runner — must also use Node 20+
FROM node:20-bullseye AS runner
WORKDIR /app

# Copy only required build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "run", "start"]
