import { BackroadNodeManager } from '@backroad/backroad';

// A 2-tab layout whose SECOND tab owns a text_input. Changing that input
// commits a value and reruns the script. The point of the demo (and its e2e
// spec) is that the rerun must NOT yank the user back to the first tab: tab
// selection is uncontrolled Radix state living on a stable-keyed component, so
// it has to survive the tree patch. Each tab echoes its own state so the spec
// can prove the rerun actually happened while the active tab held steady.
export const backroadTabsExample = (br: BackroadNodeManager) => {
  br.write({ body: '# Tabs' });

  const [first, second] = br.tabs({ labels: ['First tab', 'Second tab'] });

  first.write({ body: 'This is the first tab — it has no interactive state.' });

  second.write({ body: 'This is the second tab.' });
  const name = second.textInput({
    label: 'Your name',
    placeholder: 'Type here, then press Enter',
    defaultValue: '',
  });
  // Echo updates only after the input commits and the script reruns, so the
  // spec asserting this text also asserts that a rerun occurred.
  second.write({ body: `Hello, ${name || 'stranger'}!` });
};
