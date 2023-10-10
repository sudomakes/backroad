import { BackroadNodeManager, run } from '@backroad/backroad';
import { pages } from './pages';
// import { tableExampleData } from './data/table-example';

run((br) => {
  br.title({ label: 'Backroad Example' });
  const sidebar = br.sidebar({});
  sidebar.linkGroup({
    items: [
      { href: '/select', label: 'Select Example' },
      { href: '/charts', label: 'Charts Example' },
    ],
  });

  // br.table({
  //   data: tableExampleData,
  //   columns: { firstName: { cell: (info) => info.getValue() } },
  // });

  // // rendering examples on separate pages (defined in pages folder instead of inline)
  // f(pages.charts, br.page({ path: '/charts' }));
  f(pages.select, br.page({ path: '/select' }));
  f(pages.charts, br.page({ path: '/charts' }));
  // f(pages.markdown, br.page({ path: '/markdown' }));
  // f(pages.stats, br.page({ path: '/stats' }));
  // f(pages.columns, br.page({ path: '/columns' }));
});

const f = (
  pageContentFunc: (br: BackroadNodeManager<'page'>) => void,
  br: BackroadNodeManager<'page'>
) => {
  br.link({ label: 'go home', href: '/' });
  pageContentFunc(br);
};
