import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer shell">
      <div>
        <a
          href="/"
          className="wordmark no-underline"
          aria-label="Backroad home"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M3 12 L12 3 L21 12 L12 21 Z" />
            <path d="M8 12 L12 8 L16 12 L12 16 Z" opacity="0.45" />
          </svg>
          <span>Backroad</span>
        </a>
        <p className="tagline">Server-driven UIs you write in TypeScript.</p>
      </div>
      <div className="links">
        <div>
          <p className="col-head">Docs</p>
          <a href="/docs/" className="no-underline">
            Introduction
          </a>
          <a href="/docs/getting-started" className="no-underline">
            Getting started
          </a>
          <a href="/docs/auth" className="no-underline">
            Authentication
          </a>
          <a href="/docs/hosting" className="no-underline">
            Hosting
          </a>
        </div>
        <div>
          <p className="col-head">Code</p>
          <a
            href="https://github.com/sudomakes/backroad"
            className="no-underline"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@backroad/backroad"
            className="no-underline"
          >
            npm — backroad
          </a>
          <a
            href="https://www.npmjs.com/package/@backroad/core"
            className="no-underline"
          >
            npm — core
          </a>
        </div>
      </div>
      <p className="copyright">© {year} Backroad contributors · MIT licensed</p>
    </footer>
  );
}
