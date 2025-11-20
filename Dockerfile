# syntax = docker/dockerfile:1

# Adjustable Node version (matches local dev)
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="node"

WORKDIR /app
ENV NODE_ENV="production"

# Install pnpm globally
ARG PNPM_VERSION=10.21.0
RUN npm install -g pnpm@${PNPM_VERSION}

# Stage for installing dependencies (keeps cache-friendly layer)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Final runtime image
FROM base

# Install utilities needed at runtime (ssh-keygen for host key management)
RUN apt-get update -qq \
  && apt-get install --no-install-recommends -y openssh-client \
  && rm -rf /var/lib/apt/lists/*

# Copy dependencies and runtime source
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY docker-entrypoint.js ./docker-entrypoint.js
COPY terminal ./terminal
COPY public ./public
COPY tsconfig.json ./tsconfig.json
COPY types ./types
RUN chmod +x /app/docker-entrypoint.js

# Entrypoint prepares host keys before launching pnpm terminal:ssh
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# The SSH server listens on port 22 inside the container
EXPOSE 22
CMD [ "pnpm", "terminal:ssh" ]
