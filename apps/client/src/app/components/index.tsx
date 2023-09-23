import { Button } from './button';
import { NumberInput } from './number_input';
import { ComponentPropsMapping, InbuiltComponentTypes } from '@backroad/core';

export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (props: ComponentPropsMapping[key]) => JSX.Element;
} = {
  number_input: NumberInput,
  markdown: (props:ComponentPropsMapping["markdown"])=> <div>Markdown</div>,
  button: Button
};
