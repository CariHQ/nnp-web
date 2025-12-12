# Use the official Node.js runtime as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV CLOUD_RUN=true

# Accept build args for NEXT_PUBLIC_* variables (needed at build time for client bundle)
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_ODOO_ACCESS_TOKEN
ARG NEXT_PUBLIC_NODE_ENV

# Set as ENV so they're available during build
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_ODOO_ACCESS_TOKEN=$NEXT_PUBLIC_ODOO_ACCESS_TOKEN
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV

# Build Next.js app (Cloud Run uses standalone output)
# For Cloud Run, we don't need to generate static data - app queries DB at runtime
# We also don't need pre-build/post-build scripts (those are for static export)
# Use npx to ensure next is found in node_modules/.bin
RUN CLOUD_RUN=true npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from standalone build
# Standalone build includes server.js and necessary node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure libsql native modules are available
# The standalone build should include them, but copy from deps if they exist
RUN mkdir -p node_modules/@libsql || true
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@libsql ./node_modules/@libsql

# Ensure the server.js file exists (standalone build creates it)
RUN test -f server.js || (echo "Error: server.js not found in standalone build" && exit 1)

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

