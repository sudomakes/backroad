import { BackroadNodeManager, run } from '@backroad/backroad';

run(
  async (br) => {
    const repoData = br.getOrDefault(
      'repo-data',
      null as null | { stars: number; latestVersion: string }
    );
    br.write({
      body: `# 🛣️ Welcome to Backroad
  This is a quick start template to help you get started developing backroad apps. You can also checkout the examples on [stackblitz](https://stackblitz.com/@sudo-vaibhav/collections/backroad)`,
    });
    br.linkGroup({
      items: [
        {
          label: 'Read the Docs',
          href: 'https://backroad.sudomakes.art/docs/fundamentals/introduction/',
          target: '_blank',
        },
        {
          label: 'Learn Backroad in 3 minutes',
          href: 'https://youtube.com/',
          target: '_blank',
        },
        {
          label: 'Backroad Github',
          href: 'https://github.com/sudomakes/backroad',
          target: '_blank',
        },
        {
          label: 'Backroad Website',
          href: 'https://backroad.sudomakes.art',
          target: '_blank',
        },
        {
          label: 'Examples on Stackblitz',
          href: 'https://stackblitz.com/@sudo-vaibhav/collections/backroad',
          target: '_blank',
        },
      ],
    });
    br.write({
      body: `Backroad presents an unconventional way of **making UI with Node.JS with very minimal code**. In the complexity-ridden world of web technology, **Backroad aims to offer a simpler alternative, a road less travelled**
  
  ---
  Backroad is currently in beta-development phase. If you like the idea behind it and would like to see it develop further. Please [consider starring Backroad on Github](https://github.com/sudomakes/backroad), or tell your developer friends about it. Thanks for trying backroad 💖`,
    });

    br.columns({ columns: [0.5, 0.5] })[0].stats({
      items: [
        { label: 'Backroad Stars', value: 5 },
        { label: 'Latest Version', value: 'v1.2.1' },
      ],
    });

    br.sidebar({}).write({ body: 'hi' });
  }
  // { port: 3000 }
);

// const f = async (
//   pageContentFunc: (br: BackroadNodeManager<'page'>) => void,
//   br: BackroadNodeManager<'page'>
// ) => {
//   // br.link({ label: 'go home', href: '/' });
//   await pageContentFunc(br);
// };
// br.title({ label: 'Backroad Example' });
//     const sidebar = br.sidebar({});
//     sidebar.linkGroup({
//       items: [
//         { href: '/select', label: 'Select Example' },
//         { href: '/charts', label: 'Charts Example' },
//         { href: '/llm', label: 'LLM Example' },
//         { href: '/form', label: 'Form Example' },
//         { href: '/file-upload', label: 'File Upload Example' },
//       ],
//     });

//     const [cat, dog, chicken] = br.tabs({ labels: ['Cat', 'Dog', 'Chicken'] });
//     cat.image({
//       src: 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
//     });
//     dog.image({
//       src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/1024px-Cute_dog.jpg',
//     });
//     chicken.image({
//       src: 'https://cdn.pixabay.com/photo/2016/11/29/05/32/rooster-1867562_1280.jpg',
//     });
//     f(pages.select, br.page({ path: '/select' }));
//     f(pages.charts, br.page({ path: '/charts' }));
//     await f(pages.llm, br.page({ path: '/llm' }));
//     f(pages.form, br.page({ path: '/form' }));
//     f(pages.fileUplaod, br.page({ path: '/file-upload' }));
//     const btn = br.button({ label: 'Get joke' });
//     if (btn) {
//       const resp = await (
//         await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
//       ).json();
//       joke = resp;
//       console.log("here's a joke", joke);
//     }
//     // if (joke) {
//     br.json({ src: joke || {} });
//     // }
//     br.video({
//       src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
//     });

//     const dogPerson = br.toggle({
//       defaultValue: true,
//       label: 'Are you a Dog Person?',
//     });
//     if (dogPerson) {
//       br.write({ body: "Of course! They are man's best friend." });
//       br.image({
//         src: 'https://unsplash.com/photos/2l0CWTpcChI/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjk3MjgxNDM0fA&force=true&w=640',
//       });
//     } else {
//       br.write({ body: 'Well how about cats?' });
//       br.image({
//         src: 'https://unsplash.com/photos/yMSecCHsIBc/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjk3MjgzNDc1fA&force=true&w=640',
//       });
//     }
