import { useRef, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Local component state seeded from a server-pushed value, kept in sync WITHOUT
 * remounting.
 *
 * Backround: every value-returning widget keeps a local copy of its value so
 * typing/dragging feels instant (the authoritative value only commits to the
 * server on blur/commit). To make a server-driven change — `br.setValue(id,…)`,
 * or the new value echoed back after a commit — actually show up, the renderer
 * used to key each component by its value, forcing a full unmount+remount on any
 * change. That remount is what dropped focus, the text caret, and selection
 * mid-interaction (see TreeRender).
 *
 * Instead we adopt a new server value *during render* only when it actually
 * differs from the last one we saw (React's documented "adjusting state when a
 * prop changes" pattern), so the DOM node — and its focus — survives. While the
 * server value holds steady, in-progress local edits are left untouched, because
 * the guard never fires.
 */
export function useSyncedState<T>(
  serverValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(serverValue);
  const lastServerValue = useRef<T>(serverValue);
  // `Object.is` guard: `serverValue` only gets a new identity when a render
  // patch replaces this node (i.e. a genuine server-side change), not on the
  // re-renders triggered by local `setValue`, so this neither loops nor clobbers
  // local edits.
  if (!Object.is(serverValue, lastServerValue.current)) {
    lastServerValue.current = serverValue;
    setValue(serverValue);
  }
  return [value, setValue];
}
