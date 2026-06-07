---
title: Component IDs
---

# Component IDs

Every input component in Backroad has an **id**. The framework uses the
id to remember the input's value across script re-runs — without an
id, every keystroke would reset to the default.

By default Backroad **derives the id automatically** from the
component's props. Most of the time this is what you want. Occasionally
it isn't — this page explains when, and how to override.

## How auto-ids work

When you write:

```ts
const name = br.textInput({ label: 'Name', defaultValue: 'Ada' });
```

Backroad hashes the call's props (everything except `id` and
`defaultValue`) plus the component type, and uses that hash as the id.
Two calls with the same props get the same auto-id.

This is fine as long as the props are unique. The moment they're not,
you get a collision: two inputs sharing one slot in session state.

## The collision case

```ts
// 🛑 Two inputs, both labeled "Name" — same auto-id.
const a = br.textInput({ label: 'Name' });
const b = br.textInput({ label: 'Name' });
```

Both inputs render, but typing in one updates the other — they're
reading and writing the same session key.

## Fixing it with an explicit `id`

Pass an `id` and Backroad uses it directly:

```ts
const first = br.textInput({ label: 'Name', id: 'first-name' });
const last = br.textInput({ label: 'Name', id: 'last-name' });
```

Now each input has its own slot. The ids are arbitrary strings — pick
anything descriptive and unique within the page.

## When state preservation matters

Auto-ids are tree-position-agnostic — two calls with identical props
collide whether they're siblings or in different branches. That's
intentional: it means moving an input from a column to a tab preserves
its value, because the id doesn't change.

If you _want_ state to reset when an input moves, give it an explicit
id that encodes the location:

```ts
const value = br.textInput({
  label: 'Filter',
  id: `filter-${activeTab}`, // resets when activeTab changes
});
```

## Inspecting an id

Auto-ids are opaque hash strings; you can read them off the rendered
tree in the browser's WebSocket frames if you need to debug a collision.
The easier debugging move is to add an explicit `id` to one of the two
suspects and see if the collision goes away.

## Rule of thumb

- For most inputs, **don't pass `id`** — the auto-id is fine.
- If you have two inputs with the same label / config in the same
  script run, **give both an explicit `id`**.
- If you want an input's state to reset when some context changes,
  **encode that context into the `id`**.
