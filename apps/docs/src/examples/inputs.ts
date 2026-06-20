import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Inputs sampler' });

  const name = br.textInput({ label: 'Name', defaultValue: 'Ada' });
  const age = br.numberInput({ label: 'Age', defaultValue: 30, min: 0 });
  const fav = br.select({
    label: 'Favourite colour',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
    ],
  });
  const dark = br.toggle({ label: 'Dark mode' });

  br.write({
    body: `Hello **${name}** (${age}). You like ${fav ?? '—'}. Dark: ${dark}.`,
  });

  if (br.button({ label: 'Submit' })) {
    br.write({ body: 'Submitted!' });
  }
});
