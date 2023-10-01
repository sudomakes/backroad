import br from 'backroad';
import { backroadChartsExample } from './pages/charts';
import { backroadSelectExample } from './pages/select';
import { backroadMarkdownExample } from './pages/markdown';

(async () => {
  //   const val = await br.numberInput({
  //     label: 'Enter Value',
  //     defaultValue: 5,
  //     id: 'numinput',
  //   });
  //   br.button({ label: 'Submit', id: 'submit' });
  //   const ans = getDouble(val);

  const sidebar = await br.sidebar({});
  await br.write({ body: '# Backroad - If JS could HTML' });
  await br.image({ src: 'https://cdn.wallpapersafari.com/35/30/rmUW4V.png' });

  await sidebar.linkGroup({
    items: [
      { href: '/inline', label: 'Inline Page Example' },
      { href: '/charts', label: 'Charts Example' },
      { href: '/select', label: 'Select Example' },
      { href: '/markdown', label: 'Markdown Example' },
    ],
  });
  // you can describe pages inline
  const inlinePage = await br.page({ path: '/inline' });
  inlinePage.write({
    body: `## This page is defined inline 😇
  Feel free to [go back home](/) though.
  `,
  });
  const inlinePageSideBar = await inlinePage.sidebar({});
  inlinePageSideBar.write({ body: '### This is the hidden page sidebar' });

  // rendering examples on separate pages (defined in pages folder instead of inline)
  await backroadChartsExample(await br.page({ path: '/charts' }));
  await backroadSelectExample(await br.page({ path: '/select' }));
  await backroadMarkdownExample(await br.page({ path: '/markdown' }));
})();
