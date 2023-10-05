import { run } from 'backroad';
import { pages } from './pages';

run(async (br) => {
  const sidebar = await br.sidebar({});
  await br.write({ body: '# Backroad - If JS could HTML' });
  await br.image({ src: 'https://cdn.wallpapersafari.com/35/30/rmUW4V.png' });

  await sidebar.linkGroup({
    items: [
      { href: '/inline', label: 'Inline Page Example' },
      { href: '/charts', label: 'Charts Example' },
      { href: '/select', label: 'Select Example' },
      { href: '/markdown', label: 'Markdown Example' },
      { href: '/stats', label: 'Stats Example' },
      { href: '/columns', label: 'Columns Example' },
    ],
  });

  // rendering examples on separate pages (defined in pages folder instead of inline)
  await pages.charts(await br.page({ path: '/charts' }));
  await pages.select(await br.page({ path: '/select' }));
  await pages.markdown(await br.page({ path: '/markdown' }));
  await pages.stats(await br.page({ path: '/stats' }));
  await pages.columns(await br.page({ path: '/columns' }));
});
