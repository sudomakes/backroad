import { useSyncedState } from '../hooks/use-synced-state';
import { BackroadComponentRenderer } from '../types/components';
import { handleKeyUpBlur } from '../helpers/handleKeyUp';
import { setBackroadValue } from '../socket';
import { Input, Label } from 'backroad-ui';

export const TextInput: BackroadComponentRenderer<'text_input'> = (props) => {
  const [value, setValue] = useSyncedState(props.value);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label}</Label>
      <Input
        id={props.id}
        type="text"
        value={value}
        onKeyUp={handleKeyUpBlur}
        onBlur={(e) => {
          setBackroadValue({ id: props.id, value: e.target.value });
        }}
        onChange={(e) => setValue(e.target.value)}
        placeholder={props.args.placeholder}
      />
    </div>
  );
};
