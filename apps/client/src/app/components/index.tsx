import { BackroadComponent, InbuiltComponentTypes } from 'backroad-core';
import { Button } from './button';
import { Markdown } from './markdown';
import { NumberInput } from './number_input';

export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (
    props: BackroadComponent<key, true>
  ) => JSX.Element;
} = {
  number_input: NumberInput,
  markdown: Markdown,
  button: Button,
};
