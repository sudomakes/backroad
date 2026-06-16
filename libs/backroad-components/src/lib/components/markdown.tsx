import { lazy, Suspense } from 'react';
import { BackroadComponentRenderer } from '../types/components';

// The Streamdown renderer pulls in Shiki, Mermaid, and KaTeX — heavy deps we
// don't want in the entry bundle, since that would slow first paint and input
// hydration on every page (even ones with no markdown). Load it as an async
// chunk instead; markdown appears once it resolves, and the chunk is cached
// after the first markdown node so subsequent pages render it immediately.
const StreamdownMarkdown = lazy(() => import('./markdown-streamdown'));

export const Markdown: BackroadComponentRenderer<'markdown'> = (props) => (
  // Keying strategy depends on whether the node is streaming:
  //
  // - Static (`br.write`): key by `id` (a hash of the content). When the body
  //   changes, the id changes, so the renderer REMOUNTS. Streamdown renders
  //   block updates inside a React `useTransition` (non-urgent work); a
  //   server-driven update landing while an input holds focus (a slider
  //   mid-nudge, a focused date picker) gets starved by that urgent input work
  //   and never paints. Remounting sidesteps the transition so it always lands.
  //
  // - Streaming (`writeStream`/`streamable`): no key, so the node re-renders IN
  //   PLACE on every chunk — smooth, memoized, no remount churn (matches
  //   Streamlit). Backroad drives the streaming itself by re-emitting the whole
  //   node, so it doesn't need Streamdown's internal streaming machinery.
  <Suspense fallback={null}>
    <StreamdownMarkdown
      key={props.args.streaming ? undefined : props.id}
      {...props}
    />
  </Suspense>
);
