import br from '@backroad/backroad';

function getDouble(num: number) {
  return num * 2;
}
const val = br.numberInput({
  label: 'Enter Value',
  defaultValue: 5,
  key: 'numinput',
});
br.button({ label: 'Submit', key: 'submit' });
const ans = getDouble(val);
br.write({ body: ans });
