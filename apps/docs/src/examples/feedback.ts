import { run } from '@backroad/backroad';

run((br) => {
  br.write({ body: '# Toast demo' });

  const variant = br.select({
    label: 'Variant',
    options: [
      { value: 'info', label: 'Info' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
    ],
  });

  if (br.button({ label: 'Notify' })) {
    br.toast({
      message: `This is a ${variant ?? 'info'} toast`,
      variant: variant ?? 'info',
    });
  }
});
