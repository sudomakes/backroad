import { useSyncedState } from '../hooks/use-synced-state';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Checkbox as UICheckbox, Label } from 'backroad-ui';

export const Checkbox: BackroadComponentRenderer<'checkbox'> = (props) => {
  const [value, setValue] = useSyncedState(props.value);
  return (
    <div className="flex items-center gap-3">
      <UICheckbox
        id={props.id}
        checked={!!value}
        onCheckedChange={(checked) => {
          const newValue = checked === true;
          setValue(newValue);
          setBackroadValue({ id: props.id, value: newValue });
        }}
      />
      <Label htmlFor={props.id} className="flex-1 font-normal">
        {props.args.label}
      </Label>
    </div>
  );
};
