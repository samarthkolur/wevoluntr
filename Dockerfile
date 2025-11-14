# base image to build
FROM node:18-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# production image
FROM node:18-bullseye AS runner
WORKDIR /app

# if you use environment variables for Next.js, set them via docker run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
# install only production deps
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "run", "start"]
