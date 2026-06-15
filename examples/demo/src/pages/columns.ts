import { BackroadNodeManager } from '@backroad/backroad';

export const backroadColumnsExample = async (br: BackroadNodeManager) => {
  br.write({ body: '## Equal columns (`columns: 3`)' });
  const [col1, col2, col3] = await br.columns({ columns: 3 });

  col1.write({ body: '### Revenue' });
  col1.stats({
    items: [{ label: 'This month', value: '$12,400', delta: '+8%' }],
  });
  col1.write({ body: 'Steady growth driven by enterprise upsells.' });

  col2.write({ body: '### Users' });
  col2.stats({
    items: [{ label: 'Active today', value: '3,821', delta: '+2%' }],
  });
  col2.write({ body: 'Weekend spike from the product launch.' });

  col3.write({ body: '### Uptime' });
  col3.stats({
    items: [{ label: 'Last 30 days', value: '99.97%', delta: '-0.01%' }],
  });
  col3.write({ body: 'One minor incident on Tuesday night.' });

  br.write({ body: '---' });
  br.write({ body: '## Custom ratio (`columns: [1, 2]`)' });
  const [sidebar, main] = await br.columns({ columns: [1, 2] });

  sidebar.write({ body: '### Filters' });
  sidebar.select({
    label: 'Region',
    options: [
      { value: 'global', label: 'Global' },
      { value: 'na', label: 'North America' },
      { value: 'eu', label: 'Europe' },
      { value: 'asia', label: 'Asia' },
    ],
  });
  sidebar.select({
    label: 'Period',
    options: [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
    ],
  });

  main.write({ body: '### Sales breakdown' });
  main.write({
    body: `| Product | Units | Revenue |\n|---|---|---|\n| Backroad Pro | 142 | $28,400 |\n| Backroad Team | 87 | $43,500 |\n| Backroad Enterprise | 12 | $60,000 |`,
  });
  main.write({
    body: '_The gap between columns is controlled by `gap-1` in the grid container (`columns.tsx`)._',
  });
};
