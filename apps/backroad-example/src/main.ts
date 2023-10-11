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

  // f(pages.markdown, br.page({ path: '/markdown' }));
  // f(pages.stats, br.page({ path: '/stats' }));
  // f(pages.columns, br.page({ path: '/columns' }));
});

const f = async (
  pageContentFunc: (br: BackroadNodeManager<'page'>) => void,
  br: BackroadNodeManager<'page'>
) => {
  br.link({ label: 'go home', href: '/' });
  await pageContentFunc(br);
};
