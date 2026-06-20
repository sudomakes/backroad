import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Hello, Backroad' });

  const name = br.textInput({
    label: 'Your name',
    defaultValue: 'world',
  });

  if (name) {
    br.write({ body: `Hello, **${name}**!` });
  }

  if (br.button({ label: 'Click me' })) {
    br.write({ body: 'Clicked!' });
  }
});
