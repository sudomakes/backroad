import { BackroadNodeManager, run } from '@backroad/backroad';
import { pages } from './pages';
let joke: null | object = null;
run(async (br) => {
  br.title({ label: 'Backroad Example' });
  const sidebar = br.sidebar({});
  sidebar.linkGroup({
    items: [
      { href: '/select', label: 'Select Example' },
      { href: '/charts', label: 'Charts Example' },
      { href: '/llm', label: 'LLM Example' },
      { href: '/form', label: 'Form Example' },
      { href: '/file-upload', label: 'File Upload Example' },
    ],
  });

  const [cat, dog, chicken] = br.tabs({ labels: ['Cat', 'Dog', 'Chicken'] });
  cat.image({
    src: 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
  });
  dog.image({
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/1024px-Cute_dog.jpg',
  });
  chicken.image({
    src: 'https://cdn.pixabay.com/photo/2016/11/29/05/32/rooster-1867562_1280.jpg',
  });
  f(pages.select, br.page({ path: '/select' }));
  f(pages.charts, br.page({ path: '/charts' }));
  await f(pages.llm, br.page({ path: '/llm' }));
  f(pages.form, br.page({ path: '/form' }));
  f(pages.fileUplaod, br.page({ path: '/file-upload' }));
  const btn = br.button({ label: 'Get joke' });
  if (btn) {
    const resp = await (
      await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
    ).json();
    joke = resp;
    console.log("here's a joke", joke);
  }
  // if (joke) {
  br.json({ src: joke || {} });
  // }
  br.video({
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  });

  const dogPerson = br.toggle({
    defaultValue: true,
    label: 'Are you a Dog Person?',
  });
  if (dogPerson) {
    br.write({ body: "Of course! They are man's best friend." });
    br.image({
      src: 'https://unsplash.com/photos/2l0CWTpcChI/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjk3MjgxNDM0fA&force=true&w=640',
    });
  } else {
    br.write({ body: 'Well how about cats?' });
    br.image({
      src: 'https://unsplash.com/photos/yMSecCHsIBc/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjk3MjgzNDc1fA&force=true&w=640',
    });
  }
  // f(pages.markdown, br.page({ path: '/markdown' }));
  // f(pages.stats, br.page({ path: '/stats' }));
  // f(pages.columns, br.page({ path: '/columns' }));
});

const f = async (
  pageContentFunc: (br: BackroadNodeManager<'page'>) => void,
  br: BackroadNodeManager<'page'>
) => {
  // br.link({ label: 'go home', href: '/' });
  await pageContentFunc(br);
};
