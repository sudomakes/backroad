import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Containers demo' });

  const [left, right] = br.columns({ columns: 2 });
  left.write({ body: '## Left column' });
  if (left.button({ label: 'Left' })) {
    left.write({ body: 'Left clicked!' });
  }

  right.write({ body: '## Right column' });
  const more = right.collapse({ label: 'Show more' });
  more.write({ body: 'Hidden until you expand the panel.' });
});
