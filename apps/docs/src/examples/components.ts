import { run } from '@backroad/backroad';

run((br) => {
  br.title({ label: 'Components in one place' });

  const name = br.textInput({
    label: 'Name',
    defaultValue: 'Ada',
  });

  const excited = br.toggle({ label: 'Excited?' });

  br.write({
    body: `Hello, **${name}**${excited ? '!!!' : '.'}`,
  });

  if (br.button({ label: 'Click me' })) {
    br.write({ body: 'Button was clicked.' });
  }
});
