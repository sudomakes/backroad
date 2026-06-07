# Multi-stage build for the Backroad demo app.
#
# Build from the repo root:
#   docker build -f examples/demo/Dockerfile -t backroad-demo .
#
# Run (auth disabled — no BETTER_AUTH_SECRET):
#   docker run --rm -p 3333:3333 backroad-demo
#
# Run with email/password auth enabled:
#   docker run --rm -p 3333:3333 \
#     -e BETTER_AUTH_SECRET="$(openssl rand -base64 32)" \
#     -e BETTER_AUTH_URL=http://localhost:3333 \
#     backroad-demo

# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — build everything in a full Node + build-tools image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

# Native build deps for better-sqlite3 (downstream of @backroad-examples/demo).
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 build-essential ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

# Copy the full workspace. .dockerignore keeps node_modules, dist, .git out.
COPY . .

RUN pnpm install --frozen-lockfile

# build-demo (root script): builds backroad-frontend (vite) + the demo (esbuild
# bundle) + copies the frontend dist into dist/examples/demo/public/ so the
# express server serves it at runtime.
RUN pnpm run build-demo

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — runtime image with only the built artefact + production deps
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

# better-sqlite3 needs a native rebuild during prod install.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 build-essential ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy the self-contained dist artifact (main.js bundle + assets + public/
# frontend + a minimal package.json listing only externalized runtime deps).
COPY --from=builder /app/dist/examples/demo /app

# npm (not pnpm) is used here so we don't trip over pnpm 10's allow-builds
# gating on better-sqlite3. The dist has only 3 runtime deps; npm handles it
# cleanly and rebuilds native bindings for the runner's arch.
RUN rm -f pnpm-lock.yaml \
 && npm install --omit=dev --no-audit --no-fund

# Drop privileges.
RUN groupadd -r backroad && useradd -r -g backroad backroad \
 && chown -R backroad:backroad /app
USER backroad

EXPOSE 3333
ENV NODE_ENV=production \
    PORT=3333

CMD ["node", "main.js"]
