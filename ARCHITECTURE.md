# Backroad — Architecture

Backroad is a server-driven UI framework: a developer writes a Node script that
_declares_ a UI tree (buttons, inputs, charts, etc.) by calling methods on a `br`
proxy. The framework pushes that tree to a React client over Socket.IO, the client
renders it, and user interactions flow back as state updates that re-run the script.

This doc explains how the dirs in this monorepo map to that runtime — because the
naming used to be confusing (a single npm package is assembled from several
workspaces), and because some of the dirs look like sibling apps but are not.

---

## The mental model

There is **one published unit**: `@backroad/backroad`. That single npm package
contains both the server runtime (Express + Socket.IO + the `br` proxy) and the
React client (already-built static JS/CSS that Express serves to the browser at
runtime).

To assemble that one package, we keep the source split across **three libraries**:

| Library workspace          | Role                                                                                                                                                        | Ships inside `@backroad/backroad`?                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `libs/backroad-core`       | Pure types + event-shape definitions. Imported by both halves. Published _separately_ as `@backroad/core` so frontend-only consumers don't pull in Express. | No — published on its own                                                 |
| `libs/backroad-frontend`   | The React **app shell**: socket setup, routing, root renderer, theme switching, Vite build config. Compiled by Vite to static assets.                       | **Yes** — built output is copied into the lib's `public/` at publish time |
| `libs/backroad-components` | The leaf component renderers (`<Button>`, `<Tabs>`, `<TextInput>`, charts, etc.) imported by `backroad-frontend`. Workspace-only, not published.            | Yes — transitively, via `backroad-frontend`'s bundle                      |
| `libs/backroad`            | The Express + Socket.IO server runtime, plus the `BackroadNodeManager` (the `br` proxy that scripts call). This _is_ `@backroad/backroad`.                  | This is the npm package itself                                            |

And **one example app**:

| App workspace   | Role                                                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `examples/demo` | A working Backroad script that exercises every component (charts, forms, file upload, chat). Used as the e2e test target. Mirrors what a real consumer of `@backroad/backroad` writes. |

---

## What happens at `npm i @backroad/backroad`

1. The user installs `@backroad/backroad` from npm.
2. Inside the tarball is `src/lib/server/public/` — the pre-built React app
   (from `libs/backroad-frontend`).
3. The user writes a script:
   ```ts
   import { run } from '@backroad/backroad';
   run((br) => {
     br.write({ body: '# Hello' });
     if (br.button({ label: 'Click me' })) console.log('clicked');
   });
   ```
4. `run()` starts Express on port 3333 (or `config.server.port`), mounts
   Socket.IO, and serves `public/index.html` for any non-API route.
5. Browser loads → React app boots → opens a Socket.IO connection back to the
   same port → server re-runs the user's script per session, streams the
   resulting tree over the socket, client renders it.

No vite, no separate dev server, no two-port setup. **One Node process serves
everything.**

---

## Why the dev setup has two ports

Locally (`pnpm run dev`) we run:

- `examples/demo` on `:3333` — Express + Socket.IO + ts-rebuilt-on-save
- `libs/backroad-frontend` on `:4200` — Vite dev server with React HMR

Vite's `/api/*` proxy points to `:3333`. This is **purely for fast iteration**:
React HMR is much better than restarting the whole server every time you tweak a
component. In production both halves collapse to the single port-3333 setup
described above.

```
DEV (pnpm run dev)                  PROD (npm i @backroad/backroad)

  Browser                             Browser
     │                                   │
     ├──► :4200 (vite + HMR)             └──► :3333 (express)
     │       │                                  ├── /api/socket.io  (live)
     │       └── /api/* proxy ──┐               └── /            (static)
     │                          ▼
     └──► :3333 (express ws) ◄──┘
```

---

## How a publish actually puts the pieces together

`tools/scripts/release.mjs` orchestrates this on every release:

1. Build `libs/backroad-frontend` (vite → static JS/CSS in `dist/libs/backroad-frontend/`).
2. Build `libs/backroad-core` (tsc → `dist/libs/backroad-core/`).
3. Build `libs/backroad` (tsc → `dist/libs/backroad/`).
4. **Copy** `dist/libs/backroad-frontend/` → `dist/libs/backroad/src/lib/server/public/`.
   This is the step that puts the React app inside the server package.
5. Run `publish-package.mjs` for `dist/libs/backroad-core` and `dist/libs/backroad`.

`libs/backroad-components` never publishes directly — it's pulled into
`backroad-frontend`'s bundle via the workspace dep.

---

## Where to make a change

| You want to …                                  | Edit                                                                                                                                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a new component renderer                   | `libs/backroad-components/src/lib/components/` + corresponding `br.X()` method in `libs/backroad/src/lib/backroad/backroad.ts`                                                                           |
| Add a new container (page/columns/tabs)        | `libs/backroad-components/src/lib/containers/` + container method on `BackroadNodeManager`                                                                                                               |
| Change the socket protocol                     | `libs/backroad-core/src/lib/events.ts` (shared event types) + handlers in `libs/backroad/src/lib/server/server-socket-event-handlers/` (server) and `libs/backroad-frontend/src/lib/socket.tsx` (client) |
| Change how the script is wired into the server | `libs/backroad/src/lib/runner/index.ts`                                                                                                                                                                  |
| Add an example                                 | `examples/demo/src/pages/` + register the page in `examples/demo/src/main.ts`                                                                                                                            |
| Tune the build pipeline                        | `tools/scripts/*.mjs`                                                                                                                                                                                    |

---

## Why three libs and not one?

- **`backroad-core` separate** so a frontend-only consumer (someone building a
  custom client) can import just the types without pulling in Express.
- **`backroad-components` separate** because the components are pure render
  functions over Backroad's event types — they have no opinion about how data
  reaches them. Keeping them isolated makes them easier to story-test (Storybook
  imports them directly) and easier to swap if someone wants a non-React renderer.
- **`backroad-frontend` separate** because the _app shell_ (routing, socket
  setup, theme) is policy that consumers may eventually want to override.

This split is internal scaffolding. The user-facing surface stays small:
`@backroad/backroad` for the server, `@backroad/core` if they need the types.
