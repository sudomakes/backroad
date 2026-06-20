import { run } from '@backroad/backroad';

run((br) => {
  const sidebar = br.sidebar({});
  sidebar.write({ body: '## Sidebar' });
  const region = sidebar.select({
    label: 'Region',
    options: [
      { value: 'all', label: 'All regions' },
      { value: 'eu', label: 'EU' },
      { value: 'us', label: 'US' },
      { value: 'apac', label: 'APAC' },
    ],
    defaultValue: 'all',
  });
  sidebar.toggle({ label: 'Include archived' });

  br.write({ body: '# Dashboard' });
  br.write({ body: `Selected region: **${region}**` });
});
