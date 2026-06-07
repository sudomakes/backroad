import { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * Button that copies the current doc page's raw markdown to the clipboard.
 *
 * The @signalwire/docusaurus-plugin-llms-txt plugin writes a sibling
 * `.md` for every built HTML page (`/docs/auth/` → `/docs/auth.md`).
 * On click we fetch that file and stuff it into the clipboard so it's
 * one paste away from an LLM context window.
 */
export function CopyMarkdownButton() {
  const isBrowser = useIsBrowser();
  const { pathname } = useLocation();
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  if (!isBrowser) return null;

  // Build the .md URL: strip trailing slash, append .md
  const mdUrl =
    (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname) + '.md';

  async function copy() {
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error(`Failed to fetch ${mdUrl}: ${res.status}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const label =
    status === 'copied'
      ? '✓ Copied'
      : status === 'error'
      ? '⚠ Failed — see console'
      : '📋 Copy as markdown';

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy this page's raw markdown — useful for pasting into an AI agent"
      style={{
        marginBottom: '1rem',
        padding: '0.4rem 0.75rem',
        fontSize: '0.85rem',
        cursor: 'pointer',
        border: '1px solid var(--ifm-color-emphasis-300)',
        background: 'var(--ifm-background-surface-color)',
        color: 'var(--ifm-font-color-base)',
        borderRadius: 4,
      }}
    >
      {label}
    </button>
  );
}

export default CopyMarkdownButton;
