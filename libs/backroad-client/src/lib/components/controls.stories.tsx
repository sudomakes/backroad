import type { Story, StoryDefault } from '@ladle/react';
import { Button } from './button';
import { TextInput } from './text_input';

export default {
  title: 'Backroad Client/Controls',
} satisfies StoryDefault;

type ButtonStoryProps = {
  label: string;
};

type TextInputStoryProps = {
  label: string;
  placeholder: string;
  value: string;
};

export const ActionButton: Story<ButtonStoryProps> = ({ label }) => (
  <Button
    {...({
      id: 'ladle-button',
      type: 'button',
      value: false,
      args: { label },
    } as Parameters<typeof Button>[0])}
  />
);

ActionButton.args = {
  label: 'Run action',
};

export const FreeformTextInput: Story<TextInputStoryProps> = ({
  label,
  placeholder,
  value,
}) => (
  <TextInput
    key={`${label}-${placeholder}-${value}`}
    {...({
      id: 'ladle-text-input',
      type: 'text_input',
      value,
      args: {
        label,
        placeholder,
      },
    } as Parameters<typeof TextInput>[0])}
  />
);

FreeformTextInput.args = {
  label: 'Prompt',
  placeholder: 'Write something...',
  value: 'Backroad',
};
