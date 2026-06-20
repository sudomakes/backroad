import { run } from '@backroad/backroad';

run((br) => {
  br.title({ label: 'Markdown demo' });

  const name = br.textInput({
    label: 'Your name',
    defaultValue: 'Ada',
  });

  br.write({
    body: `

## Hello, **${name}**!

Backroad renders **GFM markdown**:

- lists
- _italic_
- tables, blockquotes, fenced code blocks

Tip: re-runs are cheap. Type freely.
`,
  });
});
