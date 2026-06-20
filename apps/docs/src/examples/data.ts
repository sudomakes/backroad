import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Data components' });

  br.stats({
    items: [
      { label: 'MRR', value: '$12,430', delta: '+8.2%' },
      { label: 'Users', value: 1842, delta: '+143' },
      { label: 'Churn', value: '1.1%', delta: '-0.3%' },
    ],
  });

  br.table({
    data: [
      { name: 'Ada', team: 'Eng', joined: '2024-01-10' },
      { name: 'Linus', team: 'Kernel', joined: '1991-09-17' },
      { name: 'Grace', team: 'Compiler', joined: '1959-04-01' },
    ],
    columns: {
      name: { header: 'Name' },
      team: { header: 'Team' },
      joined: { header: 'Joined' },
    },
  });

  br.json({
    src: { hello: 'world', nested: { count: 3, tags: ['a', 'b'] } },
  });
});
