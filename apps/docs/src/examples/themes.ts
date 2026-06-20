import { run } from '@backroad/backroad';

run(
  (br) => {
    br.write({ body: '# Themed sandbox' });
    br.write({
      body: 'Open the settings menu (top-right) to change palette and mode.',
    });

    if (br.button({ label: 'Primary action' })) {
      br.write({ body: 'Clicked.' });
    }
  },
  { appearance: { theme: 'claude', mode: 'light' } }
);
