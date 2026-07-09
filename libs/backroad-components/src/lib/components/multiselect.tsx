import ReactSelect from 'react-select';
import { getFlattenedOptions, reactSelectClassNames } from '../helpers/select';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { useSyncedState } from '../hooks/use-synced-state';
import { Label } from 'backroad-ui';
export const Multiselect: BackroadComponentRenderer<'multiselect'> = (
  props
) => {
  const flattenedOptions = getFlattenedOptions(props.args.options);
  // Controlled (was uncontrolled `defaultValue`): the renderer no longer
  // remounts this on a value change. Track the selected VALUES — which keep a
  // stable identity across local re-renders — and derive the option objects
  // react-select wants from them each render. Syncing on the freshly-filtered
  // option array instead would make useSyncedState re-fire every render.
  const [selectedValues, setSelectedValues] = useSyncedState(props.value);
  const valueOptions = flattenedOptions.filter((option) =>
    selectedValues?.includes(option.value)
  );
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label || props.id}</Label>
      <ReactSelect
        {...props.args}
        inputId={props.id}
        unstyled
        classNames={reactSelectClassNames}
        value={valueOptions}
        isMulti
        onChange={(newValue) => {
          const values = newValue.map((option) => option.value);
          setSelectedValues(values);
          setBackroadValue({ id: props.id, value: values });
        }}
      />
    </div>
  );
};
