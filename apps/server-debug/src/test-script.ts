import br from 'backroad-sdk';

const labels = ['2020', '2021', '2022', '2023'];

function getDouble(num: number) {
  return num * 2;
}

(async () => {
  //   const val = await br.numberInput({
  //     label: 'Enter Value',
  //     defaultValue: 5,
  //     id: 'numinput',
  //   });
  //   br.button({ label: 'Submit', id: 'submit' });
  //   const ans = getDouble(val);
  //   br.write({
  //     body: `## Function result returned: ${ans}
  // ### Can make tables too now 😱
  // | foo | bar |
  // | --- | --- |
  // | baz | bim |

  // ### How about rendering some code

  // ~~~python
  // print("Hello World")
  // ~~~
  //   `,
  //   });

  const menu = await br.menu({});
  menu.write({ body: '## Darkmode works!! 🍰' });
  const value = await menu.select({
    options: ['Sangeeth', 'Amol', 'Vaibhav'],
    label: 'Who is the best leetcoder?',
  });
  if (value) {
    await br.write({ body: `## You selected ${value}` });
    if (value === 'Amol') {
      await br.write({
        body: `### Makes sense, he has 1000+ problems solved 🚀`,
      });
      await br.image({
        src: 'https://media.tenor.com/-BVQhBulOmAAAAAC/bruce-almighty-morgan-freeman.gif',
      });
    } else if (value === 'Sangeeth') {
      await br.write({
        body: `### koi SIGKILL bhejdo mereko please!! 😭`,
      });
      await br.image({
        src: 'https://s.keepmeme.com/files/en_posts/20200818/7848c2160135eb558ba3b3429c07a184disappointed-bald-man-standing-disappointed-cricket-fan-meme.jpg',
      });
    }
  }
  // await br.write({
  //   body: `---`,
  // });
  // await br.line({
  //   data: {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Deep's CGPA over time",
  //         data: labels.map((_, idx) => 9 - idx),
  //       },
  //       {
  //         label: "Vaibhav's CGPA Over time",
  //         data: labels.map(() => 9.5),
  //       },
  //     ],
  //   },
  // });
})();
