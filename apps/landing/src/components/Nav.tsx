import './Nav.css';

export function Nav() {
  return (
    <header className="nav shell">
      <a href="/" className="wordmark no-underline" aria-label="Backroad home">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
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
      <nav className="nav-links">
        <a href="/docs/" className="no-underline">
          Docs
        </a>
        <a
          href="https://github.com/sudomakes/backroad"
          className="no-underline"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
