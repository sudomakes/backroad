# Backroad Demo

A working Backroad app exercising every component (charts, forms, file upload,
chat, optional email/password auth). Used in CI as the e2e target and as the
reference for what consumers of `@backroad/backroad` write.

## Run locally (dev)

From the repo root:

```bash
pnpm install
pnpm run dev        # boots backend (3333) + vite frontend (4200) in parallel
```

Then open <http://localhost:4200>.

## Run in Docker

The demo ships with a multi-stage Dockerfile that produces a self-contained
image. Build from the **repo root** (the build context must include the whole
workspace so the demo can be assembled):

```bash
docker build -f examples/demo/Dockerfile -t backroad-demo .
```

Run it:

```bash
docker run --rm -p 3333:3333 backroad-demo
```

Then open <http://localhost:3333>.

### With email/password auth enabled

The auth path activates when `BETTER_AUTH_SECRET` is set:

```bash
docker run --rm -p 3333:3333 \
  -e BETTER_AUTH_SECRET="$(openssl rand -base64 32)" \
  -e BETTER_AUTH_URL=http://localhost:3333 \
  backroad-demo
```

Visit `/`, click **Log in**, sign up via the embedded `/api/signin` form.

Without those env vars, the auth gate in `src/main.ts` is bypassed and the
demo runs unauthenticated (current behaviour for OSS users who don't want to
configure auth).

## What's inside

| File          | Role                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts` | The entry script — calls `run((br) => {...})` from `@backroad/backroad`. This is the "user code" of the demo.                                              |
| `src/auth.ts` | Optional `better-auth` instance, gated on `BETTER_AUTH_SECRET`. Uses an in-memory adapter.                                                                 |
| `src/pages/`  | Per-route definitions (charts, columns, file-upload, form, llm, markdown, select, stats). Each is a function that takes a `br.page(...)` and decorates it. |
| `Dockerfile`  | Multi-stage build → tiny runtime image (Node 20 + only runtime deps).                                                                                      |

## Architecture context

See [`ARCHITECTURE.md`](../../ARCHITECTURE.md) at the repo root for how the
libraries assemble into the published `@backroad/backroad` package and how
this demo fits in.
