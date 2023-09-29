import br from 'backroad-sdk';

function getDouble(num: number) {
  return num * 2;
}

(async () => {
  const val = await br.numberInput({
    label: 'Enter Value',
    defaultValue: 5,
    id: 'numinput',
  });
  br.button({ label: 'Submit', id: 'submit' });
  const ans = getDouble(val);
  br.write({
    body: `## Function result returned: ${ans}
### Can make tables too now 😱
| foo | bar |
| --- | --- |
| baz | bim |

### How about rendering some code

~~~python
print("Hello World")
~~~
  `,
  });
})();
