import { Button } from './button';
import { Markdown } from './markdown';
import { NumberInput } from './number_input';
import { ComponentPropsMapping, InbuiltComponentTypes } from 'backroad-core';

export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (
    props: ComponentPropsMapping[key]
  ) => JSX.Element;
} = {
  number_input: NumberInput,
  markdown: Markdown,
  button: Button,
};
