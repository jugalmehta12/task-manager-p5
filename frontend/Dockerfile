# =============================================================================
# Frontend Dockerfile — Practical 11: Containerization
# =============================================================================
# Multi-stage build:
#   Stage 1 (builder): Install dependencies and run `vite build` to produce
#                      the static production bundle in /app/dist
#   Stage 2 (runtime): Copy only the compiled assets into a slim Nginx image
#
# The final image contains no Node.js, no source code, and no node_modules —
# only the compiled HTML/CSS/JS and a lightweight web server.
#
# API communication strategy:
#   The frontend's api.js is hardcoded to http://localhost:5000/api, which
#   is the host-published backend port.  Because the browser (running on the
#   host) makes the API calls — not the Nginx container — it correctly reaches
#   the backend via the host-published port 5000.  No VITE_API_URL or Nginx
#   proxy is required.
# =============================================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first to maximise layer cache reuse
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies like vite, plugin-react)
RUN npm ci

# Copy source code
COPY . .

# Produce the production bundle → /app/dist
RUN npm run build

# ---- Stage 2: Runtime ----
FROM nginx:1.27-alpine

# Remove default Nginx config and replace with our custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.
# Docker Compose maps host:5173 → container:80.
EXPOSE 80

# Default Nginx CMD runs automatically — no override needed
