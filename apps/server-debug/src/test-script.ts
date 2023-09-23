import br from '@backroad/backroad';

function getDouble(num: number) {
  return num * 2;
}
const val = br.numberInput({ label: 'Enter Value' });
br.button({ label: 'Submit' });
const ans = getDouble(val);
br.write(ans);
