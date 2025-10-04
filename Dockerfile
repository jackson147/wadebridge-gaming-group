# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY prisma ./prisma
RUN npm install --frozen-lockfile

# Build the app
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG AUTH_SECRET
ARG AUTH_DISCORD_ID
ARG AUTH_DISCORD_SECRET
ARG DATABASE_URL
ARG AUTH_TRUST_HOST

ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_DISCORD_ID=$AUTH_DISCORD_ID
ENV AUTH_DISCORD_SECRET=$AUTH_DISCORD_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]