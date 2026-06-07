---
title: Introduction
sidebar_position: 1
---

# Backroad

Backroad lets you build React UIs without writing React. You write a Node.js
script that _declares_ a UI tree by calling methods on a `br` proxy:

```ts
import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Hello, world' });
  if (br.button({ label: 'Click me' })) {
    console.log('clicked!');
  }
});
```

Backroad bundles a pre-built React frontend inside the server package. When
the browser connects, the framework streams your declared tree over a
WebSocket and the React renderer paints it. User interactions (button clicks,
input changes, form submits) flow back to your script as state updates that
trigger a re-run — same mental model as Streamlit, but TypeScript-native.

## Why this exists

- **Stop writing the same glue twice.** Server state → API → React component →
  fetch hook → render. Backroad collapses all of it into one server script.
- **TypeScript end-to-end.** The `br` proxy is fully typed; the components it
  renders are too.
- **Batteries included.** Markdown, charts, forms, file upload, chat, theme
  switching, optional auth — all in `@backroad/backroad`.
- **Single deployable.** One Node process serves the API and the React app.

## What it's good for

- Internal tools / dashboards where the iteration cost of "spin up a CRUD
  page" matters more than pixel-perfect design control.
- LLM apps that need an interactive front-end but live mostly in Python /
  Node-side orchestration.
- Prototypes you'd otherwise build in Streamlit but want to keep in the
  TypeScript ecosystem.

## What it's not

- Not for design-driven SaaS marketing sites. Use Next.js / Astro for that.
- Not for static documentation. (This docs site uses Docusaurus.)
- Not yet for high-cardinality multi-user apps — every connected user runs
  the script on its own session.

## Next

→ [Getting started](./getting-started) to install and run your first app.
