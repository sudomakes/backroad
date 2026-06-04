# Plan: Docs Migration + llms.txt + Copy as Markdown

Branch: alpha
Status: READY TO IMPLEMENT
PR: feat/llms-txt

---

## Goal

Migrate the Backroad docs site (currently a separate Astro Starlight repo) into this monorepo as `apps/docs` using **TanStack Start** (React, Vite, Nitro). Then add `llms.txt`, `llms-full.txt`, and a "Copy as Markdown" button. One repo, one place to contribute.

---

## Context

- **Tech stack: TanStack Start** (React, Vite, Nitro) — chosen over Astro Starlight to share React components (ComponentPlayground) and keep the full stack in one ecosystem.
- TanStack Start is in Release Candidate stage (not yet v1 — API stable, some rough edges expected).
- 12 existing docs pages (currently MDX in the Astro repo) need to be ported to TSX routes.
- `apps/*` is already in `pnpm-workspace.yaml` — no workspace config change needed.
- `llms.txt` does not exist yet at `backroad.sudomakes.art/llms.txt` (404 confirmed).
- The existing `docs/assets/` at the repo root is images — move to `apps/docs/public/assets/`.

---

## Step 1: Scaffold TanStack Start app

```bash
# From repo root
mkdir -p apps/docs
cd apps/docs
npx @tanstack/cli@latest create
# Select: React, TypeScript, Tailwind (or CSS modules), no auth
```

Or clone the basic example as a starting point:

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic apps/docs
```

Then wire into monorepo:

```json
// apps/docs/package.json
{
  "name": "backroad-docs",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "preview": "vinxi start"
  }
}
```

Verify:

```bash
pnpm --filter backroad-docs run dev
# Should start TanStack Start locally on localhost:3000 (or configured port)
```

Add convenience scripts to root `package.json`:

```json
"dev:docs": "pnpm --filter backroad-docs run dev",
"build:docs": "pnpm --filter backroad-docs run build"
```

### Docs infrastructure (required before porting pages)

TanStack Start has no built-in docs-site features — add these before porting the 12 pages:

**Syntax highlighting:**

```bash
pnpm add @shikijs/rehype rehype --filter backroad-docs
```

Configure in `app.config.ts`:

```ts
import { defineConfig } from '@tanstack/start/config';
import rehypeShiki from '@shikijs/rehype';

export default defineConfig({
  // Vite config for MDX or code block processing
});
```

For inline code blocks in TSX docs pages, use a `<CodeBlock>` component wrapping Shiki's `codeToHtml`.

**Sidebar navigation:**

Create `apps/docs/app/nav-config.ts` — a static array of `{ title, slug, section }` entries for all 12 pages. The `<Sidebar>` component reads this. This also feeds the llms.txt manifest (see Step 3).

```ts
// apps/docs/app/nav-config.ts
export const navItems = [
  { section: 'Getting Started', title: 'Introduction', slug: 'introduction' },
  { section: 'Getting Started', title: 'Installation', slug: 'installation' },
  // ... 10 more
];
```

**Docs layout:**

Create `apps/docs/app/components/DocsLayout.tsx` — shared layout wrapping all docs pages with sidebar + content area:

```tsx
<div className="docs-layout">
  <Sidebar items={navItems} />
  <main data-docs-content>{children}</main>
</div>
```

Note the `data-docs-content` attribute — this is what the CopyMarkdownButton targets (Step 4).

---

## Step 2: Port 12 docs pages to TSX routes

Each docs page becomes a file-based route under `apps/docs/app/routes/docs/`:

```
apps/docs/app/routes/docs/
├── introduction.tsx
├── installation.tsx
├── getting-started.tsx
├── ... (9 more)
```

Each page exports a TanStack Start route:

```tsx
// apps/docs/app/routes/docs/introduction.tsx
import { createFileRoute } from '@tanstack/react-router';
import { DocsLayout } from '~/components/DocsLayout';
import { CodeBlock } from '~/components/CodeBlock';

export const Route = createFileRoute('/docs/introduction')({
  component: IntroductionPage,
});

export const meta = {
  title: 'Introduction',
  description: 'A Streamlit-inspired low-code framework for Node.js.',
};

function IntroductionPage() {
  return (
    <DocsLayout>
      <h1>Introduction</h1>
      <p>Backroad is a Streamlit-inspired low-code framework for Node.js.</p>
      <CodeBlock lang="ts">{`const br = backroad();\nbr.text('Hello World');`}</CodeBlock>
    </DocsLayout>
  );
}
```

The `meta` export (title + description) is used by the llms.txt manifest (Step 3).

---

## Step 3: llms.txt + llms-full.txt via static manifest

### 3a. Static manifest (generated from nav-config at build time)

`nav-config.ts` already has the page metadata. The server routes import it directly:

```ts
// apps/docs/app/routes/api/llms.txt.ts
import { navItems } from '~/nav-config';
import { createServerRoute } from '@tanstack/start/server';

const BASE = 'https://backroad.sudomakes.art';

const priority = ['introduction', 'installation', 'getting-started'];

function buildLlmsTxt() {
  const sorted = [...navItems].sort((a, b) => {
    const aP = priority.findIndex((k) => a.slug.includes(k));
    const bP = priority.findIndex((k) => b.slug.includes(k));
    if (aP !== -1 && bP === -1) return -1;
    if (bP !== -1 && aP === -1) return 1;
    return a.slug.localeCompare(b.slug);
  });

  const lines = [
    '# Backroad',
    '',
    '> A Streamlit-inspired low-code framework for Node.js. Write a script, get an interactive web app.',
    '',
    '## Documentation',
    ...sorted.map((item) => {
      const desc = item.description ? ': ' + item.description : '';
      return `- [${item.title}](${BASE}/docs/${item.slug}/)${desc}`;
    }),
    '',
    '## Source',
    '- [GitHub](https://github.com/sudomakes/backroad): Source code and example app',
    '- [npm (@backroad/backroad)](https://www.npmjs.com/package/@backroad/backroad): Install',
    '- [Quick start (trybackroad)](https://github.com/sudomakes/trybackroad): Scaffold template',
  ];

  return lines.join('\n');
}

export const ServerRoute = createServerRoute({
  GET: () =>
    new Response(buildLlmsTxt(), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }),
});
```

### 3b. llms-full.txt

Page bodies can't be introspected at runtime from TSX routes. Use `import.meta.glob` to pull the rendered HTML, or keep a `body` field in nav-config for static summaries. Simpler: use `import.meta.glob` with the route modules and a `getBody()` export per page.

```ts
// Each docs page exports getBody() returning the raw text content
export function getBody(): string {
  return `Introduction\n\nBackroad is a Streamlit-inspired...`;
}

// llms-full.txt.ts
const pages = import.meta.glob('../docs/*.tsx', { eager: true });
const sections = Object.entries(pages).map(([, mod]) => {
  const m = mod as { meta?: { title: string }; getBody?: () => string };
  const title = m.meta?.title ?? 'Untitled';
  const body = m.getBody?.() ?? '';
  return `# ${title}\n\n${body}`;
});
```

---

## Step 4: CopyMarkdownButton

### 4a. Install Turndown

```bash
pnpm add turndown @types/turndown --filter backroad-docs
```

### 4b. Create the component

```tsx
// apps/docs/app/components/CopyMarkdownButton.tsx
import TurndownService from 'turndown';

export function CopyMarkdownButton() {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const content = document.querySelector('[data-docs-content]');
    if (!content) return;

    const clone = content.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('button, [data-copy-btn]').forEach((el) => el.remove());

    const td = new TurndownService({ codeBlockStyle: 'fenced', headingStyle: 'atx' });
    td.addRule('removeEmpty', {
      filter: (node) => node.nodeType === 1 && (node as HTMLElement).innerHTML.trim() === '',
      replacement: () => '',
    });

    const markdown = td.turndown(clone.innerHTML);

    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      // Fallback for non-HTTPS or when clipboard permission denied
      const ta = document.createElement('textarea');
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = 'Copy as Markdown';
    }, 2000);
  };

  return (
    <button data-copy-btn onClick={handleClick} title="Copy page as Markdown">
      Copy as Markdown
    </button>
  );
}
```

The `data-docs-content` attribute is set on the `<main>` element in `DocsLayout` (Step 1). The button can be placed in the docs layout header.

---

## Step 5: MockBackroadSocketProvider + ComponentPlayground

### 5a. Create BackroadSocketContext in backroad-client

The backroad-client components need a socket context to inject mock vs real socket:

```ts
// libs/backroad-client/src/lib/socket-context.tsx
import { createContext, useContext } from 'react';
import type { setBackroadValue, setRunUnsetBackroadValue } from './socket';

export interface BackroadSocketContextValue {
  sessionId: string;
  setBackroadValue: typeof setBackroadValue;
  setRunUnsetBackroadValue: typeof setRunUnsetBackroadValue;
}

export const BackroadSocketContext = createContext<BackroadSocketContextValue | null>(null);

export function useBackroadSocket() {
  const ctx = useContext(BackroadSocketContext);
  if (!ctx) throw new Error('useBackroadSocket must be used within BackroadSocketContext');
  return ctx;
}
```

### 5b. Create MockBackroadSocketProvider in testing/

```ts
// libs/backroad-client/src/testing/MockBackroadSocketProvider.tsx
import { BackroadSocketContext } from '../lib/socket-context';
import { sessionId, setBackroadValue, setRunUnsetBackroadValue } from '../../.ladle/mocks/backroad-socket';
// Or extract the mock values inline — avoid importing from .ladle/ in lib code:

const mockValue = {
  sessionId: 'mock-session',
  setBackroadValue: async ({ id, value }: { id: string; value: unknown }) => {
    console.info('[mock setBackroadValue]', { id, value });
  },
  setRunUnsetBackroadValue: async ({ id, value }: { id: string; value: unknown }) => {
    console.info('[mock setRunUnsetBackroadValue]', { id, value });
  },
};

export function MockBackroadSocketProvider({ children }: { children: React.ReactNode }) {
  return <BackroadSocketContext.Provider value={mockValue}>{children}</BackroadSocketContext.Provider>;
}
```

**Important:** Do not import from `.ladle/mocks/` inside lib code — that creates a dev-dependency leak. Inline the mock values in `MockBackroadSocketProvider` directly, keeping `.ladle/mocks/` as a thin re-export.

Update `.ladle/components.tsx` to use `MockBackroadSocketProvider` from the new location.

### 5c. ErrorBoundary for ComponentPlayground

```tsx
// apps/docs/app/components/PlaygroundErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PlaygroundErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="playground-error">
          <strong>Component failed to render</strong>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 5d. ComponentPlayground

Lazy-load to avoid paying the backroad-client bundle cost on pages that don't use it:

```tsx
// apps/docs/app/components/ComponentPlayground.tsx
import { Suspense, lazy } from 'react';

const PlaygroundInner = lazy(() => import('./PlaygroundInner'));

export function ComponentPlayground({ component }: { component: string }) {
  return (
    <Suspense fallback={<div>Loading playground...</div>}>
      <PlaygroundInner component={component} />
    </Suspense>
  );
}
```

```tsx
// apps/docs/app/components/PlaygroundInner.tsx
import { MockBackroadSocketProvider } from 'backroad-client/testing';
import { PlaygroundErrorBoundary } from './PlaygroundErrorBoundary';
import { componentRegistry } from './component-registry';

export default function PlaygroundInner({ component }: { component: string }) {
  const Component = componentRegistry[component];
  if (!Component) {
    return <div>Component "{component}" not found in registry.</div>;
  }
  return (
    <MockBackroadSocketProvider>
      <PlaygroundErrorBoundary>
        <Component />
      </PlaygroundErrorBoundary>
    </MockBackroadSocketProvider>
  );
}
```

The component registry maps string names to backroad-client components. Prop editing UI (editable props) is a follow-up within this PR.

---

## Step 6: Deploy from monorepo

Add `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Docs
on:
  push:
    branches: [alpha]
    paths: ['apps/docs/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10.27.0 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter backroad-docs run build
      # Deploy apps/docs/.output/public (Nitro static output) to host
      # Adjust rsync/scp target to match your hosting config
```

Trigger only on `apps/docs/**` changes — no rebuild on library changes.

---

## Step 7: Tests

### Unit tests (vitest)

Create `apps/docs/src/` with a vitest config following the same pattern as `apps/client`:

```ts
// apps/docs/vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom' } });
```

Tests to write:

| Test file                             | What to test                                                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `llms-txt.test.ts`                    | Sort priority (intro/install first), missing description field (no crash), empty nav produces valid header |
| `llms-full-txt.test.ts`               | Sections joined with `---`, missing `getBody()` defaults to empty string                                   |
| `CopyMarkdownButton.test.tsx`         | Click calls clipboard.writeText, fallback runs when clipboard throws, button text resets after 2s          |
| `MockBackroadSocketProvider.test.tsx` | Children receive context, setBackroadValue doesn't throw                                                   |
| `PlaygroundErrorBoundary.test.tsx`    | Thrown child renders error fallback, not crash                                                             |

### E2E tests (Playwright)

Refer to `plan-playwright-e2e.md` for Playwright setup. Add these test cases:

| Test                       | Page                 | What to verify                                            |
| -------------------------- | -------------------- | --------------------------------------------------------- |
| Docs navigation            | `/docs/introduction` | Sidebar renders, content visible, copy button present     |
| Copy as Markdown           | `/docs/introduction` | Click button → clipboard contains Markdown with # heading |
| ComponentPlayground render | Any playground page  | Playground component visible, no console errors           |

---

## Step 8: Update README.md

Add to the Links section:

```markdown
**For AI tooling users:** Add `https://backroad.sudomakes.art/llms.txt` to your
Cursor rules, Claude Projects, or any AI assistant to give it complete context about
Backroad's API. Use the "Copy as Markdown" button on any docs page for a single page.
```

---

## Files touched

**apps/docs/** (new):

| File                                                   | Change                                           |
| ------------------------------------------------------ | ------------------------------------------------ |
| `apps/docs/`                                           | New TanStack Start app                           |
| `apps/docs/package.json`                               | `name: backroad-docs`, dev/build/preview scripts |
| `apps/docs/app.config.ts`                              | TanStack Start + Shiki config                    |
| `apps/docs/app/nav-config.ts`                          | Static nav/manifest for 12 pages                 |
| `apps/docs/app/routes/__root.tsx`                      | Root layout                                      |
| `apps/docs/app/routes/docs/*.tsx`                      | 12 doc pages (TSX, each exports `meta`)          |
| `apps/docs/app/routes/api/llms.txt.ts`                 | Nitro server route                               |
| `apps/docs/app/routes/api/llms-full.txt.ts`            | Nitro server route                               |
| `apps/docs/app/components/DocsLayout.tsx`              | Sidebar + `data-docs-content` main               |
| `apps/docs/app/components/Sidebar.tsx`                 | Nav from nav-config                              |
| `apps/docs/app/components/CodeBlock.tsx`               | Shiki syntax highlighting                        |
| `apps/docs/app/components/CopyMarkdownButton.tsx`      | Clipboard + fallback                             |
| `apps/docs/app/components/ComponentPlayground.tsx`     | Lazy wrapper                                     |
| `apps/docs/app/components/PlaygroundInner.tsx`         | Inner (code-split)                               |
| `apps/docs/app/components/PlaygroundErrorBoundary.tsx` | Error boundary class component                   |
| `apps/docs/vitest.config.ts`                           | Test config                                      |
| `apps/docs/src/*.test.{ts,tsx}`                        | Unit tests                                       |

**libs/backroad-client/** (modified):

| File                                                              | Change                      |
| ----------------------------------------------------------------- | --------------------------- |
| `libs/backroad-client/src/lib/socket-context.tsx`                 | New — BackroadSocketContext |
| `libs/backroad-client/src/testing/MockBackroadSocketProvider.tsx` | New — mock provider         |
| `libs/backroad-client/src/index.ts`                               | Export testing/             |

**Repo root:**

| File                                | Change                                                 |
| ----------------------------------- | ------------------------------------------------------ |
| `README.md`                         | Add llms.txt link                                      |
| `.github/workflows/deploy-docs.yml` | New deploy workflow                                    |
| `package.json`                      | Add `dev:docs`, `build:docs`                           |
| `.ladle/components.tsx`             | Update to use MockBackroadSocketProvider from testing/ |

---

## Sequencing

```
1. Scaffold TanStack Start app + docs infrastructure (Shiki, sidebar, DocsLayout)
   ↓ unblocks all parallel work

2a. Port 12 docs pages to TSX routes         ← can start alongside 2b-2e
2b. MockBackroadSocketProvider + context     ← independent (libs/ only)
2c. llms.txt + llms-full.txt server routes   ← needs nav-config from Step 1
2d. CopyMarkdownButton                       ← needs DocsLayout data-docs-content
2e. Deploy workflow                          ← independent

3. ComponentPlayground (needs 2b)
4. Unit + E2E tests (needs 2a–3)
5. README update
```

---

## Success criteria

- `pnpm --filter backroad-docs run dev` starts the TanStack Start docs site locally
- `https://backroad.sudomakes.art/llms.txt` returns 200 with valid llms.txt format
- `https://backroad.sudomakes.art/llms-full.txt` returns 200 with all docs content
- Every docs page has a "Copy as Markdown" button that copies clean Markdown to clipboard
- CopyMarkdownButton works on HTTP (fallback) and when clipboard permission is denied
- Every component docs page renders a live ComponentPlayground with editable props
- A broken component in ComponentPlayground shows a graceful error fallback
- `MockBackroadSocketProvider` can be imported from `backroad-client/testing` in both ladle and docs
- Docs deploy triggers automatically on push to `alpha` when `apps/docs/**` changes
- README links to `llms.txt`
- Vitest unit tests pass for llms.txt sort, CopyMarkdownButton, MockProvider, ErrorBoundary
- Playwright E2E: docs navigation, copy-as-markdown, ComponentPlayground render

---

## CEO Review Decisions (2026-03-28)

**Tech stack changed:** Astro Starlight → **TanStack Start** (React, Vite, Nitro)

- Pure TSX routes (no .md files — 12 existing pages need porting to JSX)
- `apps/*` workspace already covers `apps/docs/` — no pnpm-workspace.yaml change
- llms.txt + llms-full.txt as **Nitro server routes** (`app/routes/api/llms.txt.ts`)
- CopyMarkdownButton as React component, not Astro component
- **ComponentPlayground added**: extracts MockBackroadSocketProvider from `.ladle/mocks/`, renders live backroad-client components with editable props in the docs

**Known gaps fixed during eng review:**

1. ErrorBoundary around ComponentPlayground — implementation in Step 5c
2. `navigator.clipboard` fallback — implementation in Step 4b
3. MockBackroadSocketProvider must be created (not extracted) in `libs/backroad-client/src/testing/`
4. Docs infrastructure (syntax highlighting, sidebar) added to Step 1
5. CopyMarkdownButton targets `[data-docs-content]` attribute (not Starlight class)
6. llms.txt uses static manifest from `nav-config.ts` (not Astro `getCollection`)
7. ComponentPlayground lazy-loaded via `React.lazy()` + Suspense

**Deferred:**

- Pagefind search — add after content settles
- Prop editing UI in ComponentPlayground — follow-up within this PR or next

## GSTACK REVIEW REPORT

| Review        | Trigger               | Why                             | Runs | Status | Findings                                             |
| ------------- | --------------------- | ------------------------------- | ---- | ------ | ---------------------------------------------------- |
| CEO Review    | `/plan-ceo-review`    | Scope & strategy                | 1    | OPEN   | 6 proposals, 5 accepted, 1 deferred; 2 critical gaps |
| Codex Review  | `/codex review`       | Independent 2nd opinion         | 0    | —      | —                                                    |
| Eng Review    | `/plan-eng-review`    | Architecture & tests (required) | 1    | OPEN   | 8 issues, 2 critical gaps                            |
| Design Review | `/plan-design-review` | UI/UX gaps                      | 0    | —      | —                                                    |

**CRITICAL GAPS resolved by this review:**

1. ErrorBoundary — added to Step 5c
2. `navigator.clipboard` fallback — added to Step 4b

**REMAINING OPEN:** 0 unresolved decisions.

**VERDICT:** ENG REVIEW DONE — plan rewritten for TanStack Start. 8 issues addressed. Run `/plan-design-review` if adding UI/UX review, otherwise ready to implement.
