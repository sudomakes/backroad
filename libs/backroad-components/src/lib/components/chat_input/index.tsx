import { FormEvent, useState } from 'react';
import { setRunUnsetBackroadValue } from '../../socket';
import { BackroadComponentRenderer } from '../../types/components';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from 'backroad-ui';

export const ChatInput: BackroadComponentRenderer<'chat_input'> = (props) => {
  const [value, setValue] = useState(props.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (value || '').trim();
    if (!text) return;
    setRunUnsetBackroadValue({ id: props.id, value: text });
    setValue('');
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        value={value || ''}
        onChange={(e) => setValue(e.target.value || '')}
        placeholder={props.args.placeholder}
      />
      <PromptInputToolbar>
        <span />
        <PromptInputSubmit disabled={!value} />
      </PromptInputToolbar>
    </PromptInput>
  );
};
