import { run } from '@backroad/backroad';

const history = [
  { by: 'ai', content: 'Hi! Type something and I will echo it back.' },
];

async function* reply(prompt) {
  for (const word of `Echo: ${prompt}`.split(' ')) {
    await new Promise((r) => setTimeout(r, 80));
    yield word + ' ';
  }
}

run(async (br) => {
  br.write({ body: '# Mini chat' });

  for (const m of history) {
    br.chatMessage({ by: m.by }).write({ body: m.content });
  }

  const next = br.bottom().chatInput({ placeholder: 'Say something…' });
  if (next) {
    br.chatMessage({ by: 'human' }).write({ body: next });
    const text = await br.chatMessage({ by: 'ai' }).writeStream(reply(next));
    history.push({ by: 'human', content: next }, { by: 'ai', content: text });
  }
});
