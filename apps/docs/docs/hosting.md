---
title: Hosting
sidebar_position: 6
---

# Hosting

Backroad apps are a single Node process serving HTTP + WebSocket on one
port. Anything that runs Node 20+ can host them. The repository ships a
production-ready Dockerfile at `examples/demo/Dockerfile` that you can
adapt.

## Docker (recommended)

The image is multi-stage: a builder stage compiles + bundles, a runtime
stage installs only the production deps and runs `node main.js`.

```bash
# From your project root
docker build -f examples/demo/Dockerfile -t my-backroad-app .

# Run (auth disabled)
docker run --rm -p 3333:3333 my-backroad-app

# Run with email/password auth
docker run --rm -p 3333:3333 \
  -e BETTER_AUTH_SECRET="$(openssl rand -base64 32)" \
  -e BETTER_AUTH_URL=https://yourhost \
  my-backroad-app
```

## VPS deploy loop

A typical CI-less self-hosted flow:

```bash
git pull
docker build -f examples/demo/Dockerfile -t my-app .
docker stop my-app 2>/dev/null; docker rm my-app 2>/dev/null
docker run -d --name my-app --restart unless-stopped \
  -p 3333:3333 \
  -e BETTER_AUTH_SECRET="$(cat /etc/secrets/auth.secret)" \
  my-app
```

Pair with Caddy / nginx / Cloudflare Tunnel in front for TLS.

## Without Docker

Build the standalone artifact and run it directly:

```bash
pnpm run build-demo
cd dist/examples/demo
pnpm install --prod
node main.js
```

`dist/examples/demo/` contains everything the app needs: `main.js`,
`public/` (built React frontend), `package.json` listing just runtime
deps, and a lockfile.

## Reverse proxy notes

WebSocket support is mandatory — Backroad's whole UI flows over
Socket.IO. The most common reverse-proxy mistake is forgetting to
forward the WebSocket upgrade.

### Caddy

```caddy
yourhost.com {
  reverse_proxy localhost:3333
}
```

(Caddy proxies WebSockets by default.)

### nginx

```nginx
location / {
  proxy_pass http://localhost:3333;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
}
```

## Health check

The server mounts a tiny readiness probe at `/api/health` returning
`{"ok": true}` — point your orchestrator / load balancer there.

## What doesn't work yet

- Multi-process / cluster mode. Each Backroad process holds its own
  in-memory session state. Run one process per host or use sticky sessions
  if you must scale horizontally.
- Serverless platforms (Vercel / Netlify functions). Backroad needs a
  long-lived process for the WebSocket.
