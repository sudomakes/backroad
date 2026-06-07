import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started"
          >
            Get started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            style={{ marginLeft: '0.75rem' }}
            to="/intro"
          >
            Read the intro
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Server-driven React UIs you write in TypeScript."
    >
      <HomepageHeader />
      <main className="container" style={{ padding: '3rem 0' }}>
        <div className="row">
          <div className="col col--10 col--offset-1">
            <Heading as="h2">What is Backroad?</Heading>
            <p>
              You write a Node.js script that declares your UI by calling
              methods on a typed <code>br</code> proxy. Backroad ships a
              pre-built React frontend that renders your tree over a WebSocket
              and feeds user interactions back to your script. One Node process,
              no glue code.
            </p>
            <pre>
              <code>
                {`import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Hello, world' });
  if (br.button({ label: 'Click me' })) {
    console.log('clicked!');
  }
});`}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </Layout>
  );
}
