import { BackroadNodeManager } from '@backroad/backroad';

export const backroadFormExample = (br: BackroadNodeManager) => {
  const color = br.colorPicker({
    label: 'Pick a color',
  });
  if (color) {
    br.write({ body: `Selected color is ${color}` });
  }
};
