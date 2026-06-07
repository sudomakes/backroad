import './Features.css';

const snippetHtml = `<span class="t-comment">// hover any method — full IntelliSense, no docs tab needed.</span>
<span class="t-keyword">const</span> qty <span class="t-punc">=</span> <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">numberInput</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-string">'Quantity'</span><span class="t-punc">,</span> min<span class="t-punc">:</span> <span class="t-num">0</span> <span class="t-punc">});</span>
<span class="t-comment">//    ^ number — not unknown, not string | null.</span>`;

export function Features() {
  return (
    <section className="features shell">
      <header className="features-head">
        <p className="eyebrow">The pitch</p>
        <h2>
          Built for the kind of app you&rsquo;d otherwise reach for Streamlit.
        </h2>
      </header>

      <div className="grid">
        <article className="card wide">
          <p className="eyebrow">01</p>
          <h3>Typed end-to-end.</h3>
          <p>
            The <code>br</code> proxy is fully typed. Component props, return
            values, event payloads — TypeScript follows the data from your
            script into the client and back. Rename a button label; rename a
            database column. The compiler tells you what changed.
          </p>
          <pre className="snippet" aria-hidden="true">
            <code dangerouslySetInnerHTML={{ __html: snippetHtml }} />
          </pre>
        </article>
        <article className="card">
          <p className="eyebrow">02</p>
          <h3>One Node process.</h3>
          <p>
            Express + Socket.IO + the bundled React client live in one binary.{' '}
            <code>node main.js</code> is the whole production deploy.
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">03</p>
          <h3>Batteries included.</h3>
          <p>
            Markdown, charts, forms, file upload, chat, theme switching,
            optional <code>better-auth</code>. No npm scavenger hunt.
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">04</p>
          <h3>Open source.</h3>
          <p>
            MIT-licensed. No telemetry. Self-host on a $5 VPS or behind your
            Cloudflare Tunnel.
          </p>
        </article>
      </div>
    </section>
  );
}
