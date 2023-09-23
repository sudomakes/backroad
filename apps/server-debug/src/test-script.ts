import br from '@backroad/backroad';

function getDouble(num: number) {
  return num * 2;
}

const val = br.numberInput({ label: 'input' });
const ans = getDouble(2);
br.write(ans);
console.log(ans);
