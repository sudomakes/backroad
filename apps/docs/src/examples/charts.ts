import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Charts' });

  const points = br.numberInput({
    label: 'Number of points',
    defaultValue: 5,
    min: 2,
    max: 12,
  });

  const labels = Array.from({ length: points }, (_, i) => `P${i + 1}`);
  const data = labels.map(() => Math.round(Math.random() * 100));

  br.line({
    data: {
      labels,
      datasets: [{ label: 'Random walk', data, borderColor: '#3b82f6' }],
    },
  });

  br.bar({
    data: {
      labels,
      datasets: [{ label: 'Bars', data }],
    },
  });
});
