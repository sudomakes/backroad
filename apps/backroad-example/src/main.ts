import { BackroadNodeManager, run } from '@backroad/backroad';
import { pages } from './pages';
import { chartData } from './data/charts-examples';
// import { tableExampleData } from './data/table-example';

run((br) => {
  // const numImages = br.numberInput({
  //   label: 'Number of Images',
  //   defaultValue: 4.5,
  //   step: 0.01,
  //   precision: 2,
  // });
  // const [col1, col2] = br.columns({ columnCount: 2 });
  // [...Array(Math.round(numImages))].forEach((_, idx) => {
  //   (idx % 2 == 0 ? col1 : col2).image({
  //     src: `https://sudomakes.art/og?text=${idx + 1}`,
  //   });
  // });
  br.title({ label: 'Backroad Example' });
  const sidebar = br.sidebar({});
  // br.write({ body: '# Backroad - If JS could HTML' });
  // br.image({ src: 'https://cdn.wallpapersafari.com/35/30/rmUW4V.png' });

  sidebar.linkGroup({
    items: [
      // { href: '/inline', label: 'Inline Page Example' },
      // { href: '/charts', label: 'Charts Example' },
      { href: '/select', label: 'Select Example' },
      // { href: '/markdown', label: 'Markdown Example' },
      // { href: '/stats', label: 'Stats Example' },
      // { href: '/columns', label: 'Columns Example' },
    ],
  });
  br.bar(chartData.barChart);

  // br.table({
  //   data: tableExampleData,
  //   columns: { firstName: { cell: (info) => info.getValue() } },
  // });

  // // rendering examples on separate pages (defined in pages folder instead of inline)
  // f(pages.charts, br.page({ path: '/charts' }));
  f(pages.select, br.page({ path: '/select' }));
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
