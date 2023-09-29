import br from 'backroad-sdk';

const labels = ['2020', '2021', '2022', '2023'];

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

  await br.line({
    data: {
      labels,
      datasets: [
        {
          label: "Deep's CGPA over time",
          data: labels.map((_, idx) => 9 - idx),
        },
        {
          label: "Vaibhav's CGPA Over time",
          data: labels.map(() => 9.5),
        },
      ],
    },
  });
})();
