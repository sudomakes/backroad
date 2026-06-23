import { useSyncedState } from '../hooks/use-synced-state';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Input, Label } from 'backroad-ui';

// Native date picker. `change` fires once per selection (not per keystroke),
// so committing directly is cheap. Value is an ISO `YYYY-MM-DD` string.
export const DateInput: BackroadComponentRenderer<'date_input'> = (props) => {
  const [value, setValue] = useSyncedState(props.value);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label}</Label>
      <Input
        id={props.id}
        type="date"
        value={value}
        min={props.args.min}
        max={props.args.max}
        onChange={(e) => {
          setValue(e.target.value);
          setBackroadValue({ id: props.id, value: e.target.value });
        }}
      />
    </div>
  );
};
