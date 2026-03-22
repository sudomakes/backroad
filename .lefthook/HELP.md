# Backroad Git Guardrails

Backroad uses Lefthook as the Git hook transport.

## What pre-commit does

`pre-commit` stays fast and file-local. It runs:

- `forbidden-ts-nocheck`
- `merge-conflict-markers`
- staged `eslint --fix`
- staged `prettier --write`

It does not run the full workspace test/build pipeline.

## What pre-push does

`pre-push` runs the heavier local gate before code leaves your machine. It runs changed-package:

- `lint`
- `test`
- `build`

CI is still the final authority.

## Where repair artifacts are written

Canonical files:

- `.git/ai-handoffs/pre-commit-latest.md`
- `.git/ai-handoffs/pre-commit-open-in-ai.txt`
- `.git/ai-handoffs/pre-push-latest.md`
- `.git/ai-handoffs/pre-push-open-in-ai.txt`

Generic convenience aliases:

- `.git/ai-handoffs/latest.md`
- `.git/ai-handoffs/open-in-ai.txt`

## What the AI prompt files are

The `open-in-ai.txt` files are the preferred workflow for Codex or Claude. Paste that file first. It tells the agent which repo files to read, including the repair artifact and the hook helper code.

## Manual commands

- `pnpm pre-commit-check`
- `pnpm pre-push-check`
- `pnpm hook-help`

## When to paste the full Markdown artifact instead

Paste the full `.md` artifact only when your AI tool cannot read files from this repo. Otherwise prefer the `open-in-ai.txt` file because it keeps the prompt short and lets the agent inspect the repo context directly.
