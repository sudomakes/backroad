import br from 'backroad-sdk';

function getDouble(num: number) {
  return num * 2;
}
console.debug('trying to get value');
(async () => {
  const val = await br.numberInput({
    label: 'Enter Value',
    defaultValue: 5,
    key: 'numinput',
  });
  console.debug('got value', val, 'rendering button');
  br.button({ label: 'Submit', key: 'submit' });
  console.debug('rendered button, getting double');
  const ans = getDouble(val);
  console.debug('got double', ans, 'writing to backroad');
  br.write({ body: ans });
})();
