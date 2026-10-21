# =============================================================================
# Backend Dockerfile — Practical 11: Containerization
# =============================================================================
# Node.js 20 LTS on Alpine Linux (smallest reliable image for this runtime).
# Uses npm ci (not npm install) to guarantee the installed tree matches the
# committed package-lock.json exactly — required for reproducible builds.
# =============================================================================

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first so Docker can cache this layer.
# As long as package.json and package-lock.json are unchanged, the expensive
# `npm ci` step is skipped on subsequent builds.
COPY package.json package-lock.json ./

# Install production dependencies only.
# npm ci requires package-lock.json and never modifies it, ensuring the image
# always contains the exact versions committed to version control.
RUN npm ci --omit=dev

# Copy the rest of the backend source code.
# .dockerignore prevents node_modules and .env from being copied.
COPY . .

# Document the port the application listens on.
# Note: EXPOSE is documentation only — actual port binding is done in Compose.
EXPOSE 5000

# Start the backend using Node directly (nodemon is a dev dependency only).
# The PORT, MONGO_URI, and JWT_SECRET are injected at runtime via Compose.
CMD ["node", "server.js"]
