import br from 'backroad-sdk';
import { backroadChartsExample } from './pages/charts';
import { backroadSelectExample } from './pages/select';

(async () => {
  //   const val = await br.numberInput({
  //     label: 'Enter Value',
  //     defaultValue: 5,
  //     id: 'numinput',
  //   });
  //   br.button({ label: 'Submit', id: 'submit' });
  //   const ans = getDouble(val);
  //   br.write({
  //     body: `## Function result returned: ${ans}
  // ### Can make tables too now 😱
  // | foo | bar |
  // | --- | --- |
  // | baz | bim |

  // ### How about rendering some code

  // ~~~python
  // print("Hello World")
  // ~~~
  //   `,
  //   });

  const menu = await br.menu({});
  await br.write({ body: '# Backroad - If JS could HTML' });
  await br.image({ src: 'https://cdn.wallpapersafari.com/35/30/rmUW4V.png' });
  menu.write({
    body: `[Inline Page Example](/inline)
---
[Charts Example](/charts)
---
[Select Example](/select)`,
  });

  // you can describe pages inline
  const inlinePage = await br.page({ path: '/inline' });
  inlinePage.write({
    body: `## This page is defined inline 😇
  Feel free to [go back home](/) though.
  `,
  });
  const hiddenPageSideBar = await inlinePage.menu({});
  hiddenPageSideBar.write({ body: '### This is the hidden page sidebar' });

  // rendering examples on separate pages (defined in pages folder instead of inline)
  await backroadChartsExample(await br.page({ path: '/charts' }));
  await backroadSelectExample(await br.page({ path: '/select' }));
})();
