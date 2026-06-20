import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Layout' });

  const [left, right] = br.columns({ columns: [1, 2] });
  left.write({ body: '## Narrow' });
  left.toggle({ label: 'Switch' });

  const [a, b] = right.tabs({ labels: ['Tab A', 'Tab B'] });
  a.write({ body: 'Hello from **Tab A**.' });
  b.write({ body: 'Hello from **Tab B**.' });
});
