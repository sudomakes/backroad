import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Multimedia' });

  const url = br.textInput({
    label: 'Image URL',
    defaultValue: 'https://placekitten.com/640/360',
  });

  if (url) {
    br.image({ src: url, alt: 'preview', width: 480 });
  }
});
