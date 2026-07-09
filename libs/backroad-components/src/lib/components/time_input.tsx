import { useSyncedState } from '../hooks/use-synced-state';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Input, Label } from 'backroad-ui';

// Native time picker. Value is a 24-hour `HH:mm` string. `step` (seconds)
// switches the picker to second-level granularity when provided.
export const TimeInput: BackroadComponentRenderer<'time_input'> = (props) => {
  const [value, setValue] = useSyncedState(props.value);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label}</Label>
      <Input
        id={props.id}
        type="time"
        value={value}
        step={props.args.step}
        onChange={(e) => {
          setValue(e.target.value);
          setBackroadValue({ id: props.id, value: e.target.value });
        }}
      />
    </div>
  );
};
