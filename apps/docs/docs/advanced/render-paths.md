---
title: Render paths
---

# Render paths

Backroad uses a custom string format for **paths** — addresses that
identify exactly where in the rendered tree a node lives. The framework
uses paths to patch the React tree on every script re-run without
re-mounting unchanged subtrees.

You don't need to think about paths to use Backroad. This page is for
when you're debugging tree behavior or building a tool that introspects
the rendered output.

## The shape

A path is a dot-separated string that walks the tree from the implicit
root:

```
children.0
children.1
children.2.children.0
children.2.children.1
```

Each segment is one of:

- `children.N` — the Nth child of the current container.
- `<custom-key>.children.N` — if a child is itself a container, its
  own children continue from its path.

So a button that's the second child of the first column in
`br.columns({ columns: 2 })` ends up at something like:

```
children.0.children.1
```

…where `children.0` is the `columns` container's first column-base, and
`children.1` is the button inside it.

## When you actually see them

Paths show up in:

- The **render payload** sent over the WebSocket — every node carries
  its `path`, so the React renderer knows where to upsert.
- The browser dev console when Backroad logs render diffs.
- The internal `RenderQueue` (see `libs/backroad/src/lib/server`).

Paths are _structural_ — they're not stable across reorderings. Swap two
`br.write` calls and their paths swap too. For stable identity of input
state across reorderings, see [Component IDs](./component-ids).

## Why a custom format?

Two reasons:

1. **Stringly typed**: paths are easy to log, easy to put in a URL, easy
   to use as keys in the patch queue.
2. **Deterministic from tree structure alone**: the framework derives
   them in one pass while walking the tree, no lookup needed.
