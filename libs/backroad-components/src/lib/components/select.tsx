import ReactSelect from 'react-select';
import { getFlattenedOptions, reactSelectClassNames } from '../helpers/select';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { useSyncedState } from '../hooks/use-synced-state';
import { Label } from 'backroad-ui';

export const Select: BackroadComponentRenderer<'select'> = (props) => {
  // Controlled (was uncontrolled `defaultValue`): the renderer no longer
  // remounts this on a value change, so the selection has to be driven by
  // state. Seed + resync from the server value via useSyncedState, and update
  // optimistically on change so the menu reflects the pick before the rerun
  // round-trips.
  const [value, setValue] = useSyncedState(
    getFlattenedOptions(props.args.options).find(
      (option) => option.value === props.value
    ) ?? null
  );
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label || props.id}</Label>
      <ReactSelect
        {...props.args}
        inputId={props.id}
        unstyled
        classNames={reactSelectClassNames}
        value={value}
        onChange={(newValue) => {
          setValue(newValue ?? null);
          setBackroadValue({ id: props.id, value: newValue?.value });
        }}
      />
    </div>
  );
};
