import './Manifesto.css';

export function Manifesto() {
  return (
    <section className="manifesto shell">
      <div className="grid">
        <div>
          <p className="eyebrow">What you don&rsquo;t write</p>
          <ul className="cross">
            <li>API routes for every form submission.</li>
            <li>
              <code>useState</code> + <code>useEffect</code> + a fetch hook for
              every input.
            </li>
            <li>
              JSON schemas that drift from your zod schemas that drift from your
              DB columns.
            </li>
            <li>Auth wiring between three layers of middleware.</li>
            <li>A WebSocket reconnect strategy.</li>
            <li>A loading spinner. (Backroad has one.)</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">What you do write</p>
          <ul className="check">
            <li>A Node script. That&rsquo;s the app.</li>
            <li>
              Method calls on a typed <code>br</code> proxy that map 1:1 to
              React renderers.
            </li>
            <li>
              Plain TypeScript control flow — <code>if</code>, <code>for</code>,{' '}
              <code>async/await</code>.
            </li>
            <li>
              Optional <code>better-auth</code> instance if you want
              email/password or OAuth.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
