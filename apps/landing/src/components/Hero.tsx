import './Hero.css';

const codeHtml = `<span class="t-keyword">import</span> <span class="t-punc">{</span> run <span class="t-punc">}</span> <span class="t-keyword">from</span> <span class="t-string">'@backroad/backroad'</span><span class="t-punc">;</span>

<span class="t-fn">run</span><span class="t-punc">((</span><span class="t-var">br</span><span class="t-punc">) =&gt; {</span>
  <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">write</span><span class="t-punc">({</span> body<span class="t-punc">:</span> <span class="t-string">'# Hello, world'</span> <span class="t-punc">});</span>

  <span class="t-keyword">const</span> name <span class="t-punc">=</span> <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">textInput</span><span class="t-punc">({</span>
    label<span class="t-punc">:</span> <span class="t-string">'Your name'</span><span class="t-punc">,</span>
    defaultValue<span class="t-punc">:</span> <span class="t-string">'world'</span><span class="t-punc">,</span>
  <span class="t-punc">});</span>

  <span class="t-keyword">if</span> <span class="t-punc">(</span>name<span class="t-punc">) {</span>
    <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">write</span><span class="t-punc">({</span> body<span class="t-punc">:</span> <span class="t-string">\`Hello, **\${name}**!\`</span> <span class="t-punc">});</span>
  <span class="t-punc">}</span>

  <span class="t-keyword">if</span> <span class="t-punc">(</span><span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">button</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-string">'Click me'</span> <span class="t-punc">})) {</span>
    <span class="t-comment">// re-runs on click; state lives server-side</span>
    <span class="t-var">console</span><span class="t-punc">.</span><span class="t-fn">log</span><span class="t-punc">(</span><span class="t-string">'clicked'</span><span class="t-punc">);</span>
  <span class="t-punc">}</span>
<span class="t-punc">});</span>`;

export function Hero() {
  return (
    <section className="hero shell">
      <div className="hero-backdrop bg-dots mask-fade" aria-hidden="true" />
      <div className="hero-left">
        <p
          className="eyebrow reveal"
          style={{ ['--d' as string]: '0ms' } as React.CSSProperties}
        >
          Open source · TypeScript
        </p>
        <h1
          className="reveal"
          style={{ ['--d' as string]: '80ms' } as React.CSSProperties}
        >
          Stop writing
          <br />
          <span className="strike">React, APIs, hooks,</span>
          <br />
          and the glue between.
        </h1>
        <p
          className="lede reveal"
          style={{ ['--d' as string]: '220ms' } as React.CSSProperties}
        >
          Backroad is a server-driven UI framework. You write a Node script that
          declares your interface; Backroad streams it to a pre-built React
          client over a WebSocket. One process. Typed end-to-end. No useState.
          No fetch hooks. No CRUD pages.
        </p>
        <div
          className="ctas reveal"
          style={{ ['--d' as string]: '340ms' } as React.CSSProperties}
        >
          <a href="/docs/getting-started" className="btn btn-primary">
            Get started{' '}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a href="/docs/" className="btn btn-ghost">
            Read the docs
          </a>
        </div>
        <p
          className="install reveal"
          style={{ ['--d' as string]: '460ms' } as React.CSSProperties}
        >
          <code>npm install @backroad/backroad</code>
        </p>
      </div>

      <div
        className="hero-right reveal"
        style={{ ['--d' as string]: '520ms' } as React.CSSProperties}
      >
        <figure className="terminal">
          <header className="terminal-head">
            <span className="dot dot-red" />
            <span className="dot dot-amber" />
            <span className="dot dot-green" />
            <span className="terminal-title">app.ts</span>
          </header>
          <pre className="terminal-body">
            <code dangerouslySetInnerHTML={{ __html: codeHtml }} />
          </pre>
        </figure>

        <figure className="preview">
          <header className="preview-head">
            <span className="preview-url">localhost:3333</span>
            <span className="preview-status">live</span>
          </header>
          <div className="preview-body">
            <h2>Hello, world</h2>
            <label>
              <span>Your name</span>
              <input type="text" defaultValue="world" readOnly />
            </label>
            <p className="preview-greet">
              Hello, <strong>world</strong>!
            </p>
            <button className="preview-btn">Click me</button>
          </div>
        </figure>
      </div>
    </section>
  );
}
