# Plan: Docs Migration + llms.txt + Copy as Markdown

Branch: alpha
Status: READY TO IMPLEMENT
PR: feat/llms-txt

---

## Goal

Migrate the Backroad docs site (currently a separate Astro Starlight repo) into this monorepo as `apps/docs`. Then add `llms.txt`, `llms-full.txt`, and a "Copy as Markdown" button. One repo, one place to contribute.

---

## Context

- Docs site: **Astro Starlight** (Astro v5.6.1, Starlight v0.32.6)
- Currently lives at a separate repo — migrate to `apps/docs/` in this monorepo
- `apps/*` is already in `pnpm-workspace.yaml` — no workspace config change needed
- `llms.txt` does not exist yet at `backroad.sudomakes.art/llms.txt` (confirmed 404)
- Starlight stores docs as MDX/Markdown in `src/content/docs/`

---

## Step 1: Migrate docs into this repo

```bash
# From repo root
# Option A: if docs repo is on GitHub
git clone <docs-repo-url> apps/docs --depth=1
rm -rf apps/docs/.git   # detach from old remote, it's now part of this repo

# Option B: copy files manually if simpler
mkdir -p apps/docs
# copy all docs site files into apps/docs/
```

After copying:

```bash
# Verify it works standalone
cd apps/docs
pnpm install
pnpm dev       # should start Starlight locally
```

The existing `docs/assets/` directory at the repo root is just images — leave it, or move to `apps/docs/public/` if the Starlight site references them.

---

## Step 2: Wire docs into the monorepo

### apps/docs/package.json — add standard scripts

Ensure these exist (Starlight scaffold usually includes them):

```json
{
  "name": "backroad-docs",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

`pnpm-workspace.yaml` already covers `apps/*` — no change needed.

### Add to root package.json scripts (optional convenience):

```json
"dev:docs": "pnpm --filter backroad-docs run dev",
"build:docs": "pnpm --filter backroad-docs run build"
```

---

## Step 3: Deploy from monorepo

The current deployment is separate. Update to deploy from this repo.

Two options depending on current host:

**If hosted on Netlify/Vercel:**

- Point the deployment to `apps/docs/` as the project root
- Build command: `pnpm --filter backroad-docs run build`
- Output dir: `apps/docs/dist`

**If self-hosted (current setup uses SSH + Docker based on CI):**

- Add a new GitHub Actions workflow `.github/workflows/deploy-docs.yml`:

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
      # then deploy dist/ to host via rsync/scp/etc.
```

Trigger only on changes under `apps/docs/**` — no need to rebuild docs on every library change.

---

## Step 4: llms.txt — dynamic Astro endpoint

Create `apps/docs/src/pages/llms.txt.ts`. Generates from the content collection automatically as docs grow.

```ts
// apps/docs/src/pages/llms.txt.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const docs = await getCollection('docs');

  const sorted = docs.sort((a, b) => {
    // Prioritise intro/installation pages
    const priority = ['introduction', 'installation', 'getting-started'];
    const aP = priority.findIndex((k) => a.slug.includes(k));
    const bP = priority.findIndex((k) => b.slug.includes(k));
    if (aP !== -1 && bP === -1) return -1;
    if (bP !== -1 && aP === -1) return 1;
    return a.slug.localeCompare(b.slug);
  });

  const base = 'https://backroad.sudomakes.art';

  const lines = [
    '# Backroad',
    '',
    '> A Streamlit-inspired low-code framework for Node.js. Write a script, get an interactive web app.',
    '',
    '## Documentation',
    ...sorted.map((doc) => {
      const desc = doc.data.description ? ': ' + doc.data.description : '';
      return `- [${doc.data.title}](${base}/docs/${doc.slug}/)${desc}`;
    }),
    '',
    '## Source',
    '- [GitHub](https://github.com/sudomakes/backroad): Source code and example app',
    '- [npm (@backroad/backroad)](https://www.npmjs.com/package/@backroad/backroad): Install',
    '- [Quick start (trybackroad)](https://github.com/sudomakes/trybackroad): Scaffold template',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

---

## Step 5: llms-full.txt — full docs concatenation

```ts
// apps/docs/src/pages/llms-full.txt.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const docs = await getCollection('docs');

  const sections = docs.map((doc) => [`# ${doc.data.title}`, `URL: https://backroad.sudomakes.art/docs/${doc.slug}/`, '', doc.body].join('\n'));

  return new Response(sections.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

---

## Step 6: Copy as Markdown button

Starlight uses `.sl-markdown-content` as the selector for the page body. The button reads that element, strips interactive/nav nodes, and converts to Markdown via Turndown.

### 6a. Install Turndown

```bash
pnpm add turndown @types/turndown --filter backroad-docs
```

### 6b. Create the component

```astro
// apps/docs/src/components/CopyMarkdownButton.astro
<button id="copy-md-btn" class="copy-md-btn" title="Copy page as Markdown">
  Copy as Markdown
</button>

<style>
  .copy-md-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 4px;
    background: transparent;
    color: var(--sl-color-text);
  }
  .copy-md-btn:hover { background: var(--sl-color-gray-6); }
</style>

<script>
  import TurndownService from 'turndown';

  document.getElementById('copy-md-btn')?.addEventListener('click', async function() {
    const content = document.querySelector('.sl-markdown-content');
    if (!content) return;

    const clone = content.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('button, .copy-md-btn').forEach(el => el.remove());

    const td = new TurndownService({ codeBlockStyle: 'fenced', headingStyle: 'atx' });
    td.addRule('removeEmpty', {
      filter: (node) => node.nodeType === 1 && (node as HTMLElement).innerHTML.trim() === '',
      replacement: () => '',
    });

    const markdown = td.turndown(clone.innerHTML);
    await navigator.clipboard.writeText(markdown);

    this.textContent = 'Copied!';
    setTimeout(() => { this.textContent = 'Copy as Markdown'; }, 2000);
  });
</script>
```

### 6c. Inject via Starlight's ContentPanel override

Starlight v0.32 supports overriding the `ContentPanel` component, which wraps every page's content area — cleaner than a full Header override.

```ts
// apps/docs/astro.config.mjs
starlight({
  components: {
    ContentPanel: './src/components/ContentPanelWithCopyButton.astro',
  },
});
```

```astro
// apps/docs/src/components/ContentPanelWithCopyButton.astro
---
import Default from '@astrojs/starlight/components/ContentPanel.astro';
import CopyMarkdownButton from './CopyMarkdownButton.astro';
---
<div style="position: relative;">
  <CopyMarkdownButton />
  <Default><slot /></Default>
</div>
```

If `ContentPanel` isn't available as an override in this Starlight version, use `PageFrame` or inject via a custom `<head>` script. Check the Starlight override docs for v0.32 to confirm available slots.

---

## Step 7: Update README.md (this repo)

Add to the Links section:

```markdown
**For AI tooling users:** Add `https://backroad.sudomakes.art/llms.txt` to your
Cursor rules, Claude Projects, or any AI assistant to give it complete context about
Backroad's API. Use the "Copy as Markdown" button on any docs page for a single page.
```

---

## Files touched

**apps/docs/** (migrated + new):

| File                                                        | Change                                           |
| ----------------------------------------------------------- | ------------------------------------------------ |
| `apps/docs/`                                                | New directory — migrated from separate repo      |
| `apps/docs/package.json`                                    | Ensure `name`, `dev`, `build`, `preview` scripts |
| `apps/docs/src/pages/llms.txt.ts`                           | New — dynamic llms.txt                           |
| `apps/docs/src/pages/llms-full.txt.ts`                      | New — full docs concatenation                    |
| `apps/docs/src/components/CopyMarkdownButton.astro`         | New                                              |
| `apps/docs/src/components/ContentPanelWithCopyButton.astro` | New                                              |
| `apps/docs/astro.config.mjs`                                | Register ContentPanel override                   |

**Repo root:**

| File                                | Change                                           |
| ----------------------------------- | ------------------------------------------------ |
| `README.md`                         | Add llms.txt link                                |
| `.github/workflows/deploy-docs.yml` | New — deploy docs on push to alpha               |
| `package.json`                      | Add `dev:docs`, `build:docs` convenience scripts |

---

## Sequencing

```
1. Migrate docs into apps/docs/ and verify pnpm dev works     ← unblocks everything
2. Add llms.txt.ts + llms-full.txt.ts endpoints               ← 30 min
3. Add CopyMarkdownButton + ContentPanel override              ← 1 hr
4. Set up deploy-docs.yml workflow                             ← 30 min
5. Update README.md                                            ← 5 min
```

---

## Success criteria

- `pnpm --filter backroad-docs run dev` starts the docs site locally from this repo
- `https://backroad.sudomakes.art/llms.txt` returns 200 with valid llms.txt format
- `https://backroad.sudomakes.art/llms-full.txt` returns 200 with all docs as markdown
- Every docs page has a "Copy as Markdown" button that copies clean markdown to clipboard
- Docs deploy is triggered automatically on push to `alpha` when `apps/docs/**` changes
- README links to `llms.txt`
