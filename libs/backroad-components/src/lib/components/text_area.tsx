import { useState } from 'react';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Label, Textarea } from 'backroad-ui';

// Unlike text_input, Enter must insert a newline rather than commit, so there's
// no handleKeyUpBlur here — the value commits on blur only.
export const TextArea: BackroadComponentRenderer<'text_area'> = (props) => {
  const [value, setValue] = useState(props.value);
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label}</Label>
      <Textarea
        id={props.id}
        rows={props.args.rows}
        value={value}
        placeholder={props.args.placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          setBackroadValue({ id: props.id, value: e.target.value });
        }}
      />
    </div>
  );
};
