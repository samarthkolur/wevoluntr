# Builder — must use Node 20+
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# --- IMPORTANT FIX ---
# Use a syntactically valid dummy Mongo URI for build
# (real URI will be injected at runtime from Jenkins)
ARG MONGODB_URI="mongodb://localhost:27017/dummy"
ENV MONGODB_URI=${MONGODB_URI}

# Build Next.js app
RUN npm run build


# -------------------------
# Production runner
# -------------------------
FROM node:20-bullseye AS runner
WORKDIR /app

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "run", "start"]
