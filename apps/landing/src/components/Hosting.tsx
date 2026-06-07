import './Hosting.css';

const deployHtml = `<span class="t-comment"># Build the image (multi-stage; ~80 MB runtime layer)</span>
<span class="t-prompt">$</span> docker build <span class="t-flag">-f</span> examples/demo/Dockerfile <span class="t-flag">-t</span> my-app <span class="t-punc">.</span>

<span class="t-comment"># Run it. Same single binary in prod as in dev.</span>
<span class="t-prompt">$</span> docker run <span class="t-flag">-p</span> 3333:3333 <span class="t-flag">-e</span> BETTER_AUTH_SECRET<span class="t-punc">=</span>...  my-app
<span class="t-out">Server started and can be accessed on http://localhost:3333/</span>`;

export function Hosting() {
  return (
    <section className="hosting shell">
      <div className="grid">
        <div className="text">
          <p className="eyebrow">Hosting</p>
          <h2>One process. Any box.</h2>
          <p>
            Backroad apps are a single Node binary serving HTTP and WebSocket on
            the same port. No serverless cold starts. No edge runtime quirks. A
            $5 VPS, a Fly machine, your homelab — whatever runs Node 20 runs
            Backroad.
          </p>
          <ul className="bullets">
            <li>Multi-stage Dockerfile ships with every example.</li>
            <li>
              Health check at <code>/api/health</code>.
            </li>
            <li>Drop-in behind Caddy / nginx / Cloudflare Tunnel.</li>
          </ul>
          <a href="/docs/hosting" className="link-arrow">
            Read the hosting guide <span aria-hidden="true">→</span>
          </a>
        </div>

        <figure className="terminal">
          <header className="terminal-head">
            <span className="dot dot-red" />
            <span className="dot dot-amber" />
            <span className="dot dot-green" />
            <span className="terminal-title">~/my-app</span>
          </header>
          <pre className="terminal-body">
            <code dangerouslySetInnerHTML={{ __html: deployHtml }} />
          </pre>
        </figure>
      </div>
    </section>
  );
}
