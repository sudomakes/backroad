import './CtaStrip.css';

export function CtaStrip() {
  return (
    <section className="cta shell">
      <div className="cta-inner">
        <p className="eyebrow">Ready?</p>
        <h2>
          It really is just <code>npm install</code>.
        </h2>
        <div className="ctas">
          <a href="/docs/getting-started" className="btn btn-primary">
            Get started{' '}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a
            href="https://github.com/sudomakes/backroad"
            className="btn btn-ghost"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
