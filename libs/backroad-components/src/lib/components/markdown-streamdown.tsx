import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';
import { mermaid } from '@streamdown/mermaid';
import { createMathPlugin } from '@streamdown/math';
import { Link } from 'react-router-dom';
import { BackroadComponentRenderer } from '../types/components';
// Streamdown's own keyframes/utilities, plus KaTeX glyph styles for math.
import 'streamdown/styles.css';
import 'katex/dist/katex.min.css';

// Streamdown 2.x ships syntax highlighting (Shiki), Mermaid diagrams, and
// KaTeX math as separate, opt-in plugin packages — registered here so code
// blocks highlight, ```mermaid fences render as diagrams, and $math$ renders.
// `singleDollarTextMath` lets inline `$x$` render (off by default so prices
// like "$5" aren't mistaken for math).
const plugins = {
  code,
  mermaid,
  math: createMathPlugin({ singleDollarTextMath: true }),
};

// Default export so the consumer can `React.lazy(() => import(...))` it — this
// is what keeps Shiki/Mermaid/KaTeX out of the entry bundle. See ./markdown.
const StreamdownMarkdown: BackroadComponentRenderer<'markdown'> = (props) => {
  return (
    <Streamdown
      className="max-w-none"
      // Backroad drives streaming at the node level (it re-emits the whole
      // markdown node with the growing body), so every render Streamdown sees
      // is a complete snapshot. Static mode disables Streamdown's own streaming
      // animation/transitions — which otherwise defer the commit and can drop a
      // re-render that lands while an input is focused (a slider/date echo not
      // updating until the next interaction).
      mode="static"
      // Light/dark Shiki themes; Streamdown renders both and toggles on the
      // `.dark` class the theme provider sets, matching the rest of the app.
      shikiTheme={['github-light', 'github-dark']}
      // Copy/download/fullscreen affordances on code, tables, and diagrams.
      controls={{ code: true, table: true, mermaid: true }}
      plugins={plugins}
      components={{
        // Route internal links through react-router; external links open in a
        // new tab. (Streamdown handles code blocks, tables, and mermaid
        // itself — no `pre` override needed anymore.)
        a: ({ href, children }) =>
          href && /^https?:\/\//.test(href) ? (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ) : (
            <Link to={href || '/'}>{children}</Link>
          ),
      }}
    >
      {props.args.body.toString()}
    </Streamdown>
  );
};

export default StreamdownMarkdown;
