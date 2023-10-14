import { BackroadNodeManager } from '@backroad/backroad';

export const backroadFormExample = (br: BackroadNodeManager) => {
  const color = br.colorPicker({ label: 'Pick a color' });
  const [left, right] = br.columns({ columnCount: 2 });
  const printValue = left.toggle({ label: 'Print the selected value' });
  const showRGB = right.checkbox({ label: 'Show as RGB' });
  if (printValue) {
    br.write({
      body: `Selected color is ${
        showRGB ? JSON.stringify(hexToRgb(color)) : color
      }`,
    });
  } else {
    br.write({ body: "Sorry, can't say" });
  }

  const bestOS = br.radio({
    label: 'Which is the best OS?',
    options: ['Windows', 'Mac', 'Linux'],
  });

  br.write({ body: `## ${bestOS} is best!!` });
  const str = br.textInput({ label: 'Enter your string' });
  br.write({ body: `double: ${str + str}` });

  //   br.write({
  //     body: `## Files
  // ${files.map((file) => `* ${file.originalname}`).join('\n')}`,
  //   });
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
