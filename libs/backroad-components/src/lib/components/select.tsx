import ReactSelect from 'react-select';
import { getFlattenedOptions, reactSelectClassNames } from '../helpers/select';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { Label } from 'backroad-ui';

export const Select: BackroadComponentRenderer<'select'> = (props) => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label || props.id}</Label>
      <ReactSelect
        {...props.args}
        inputId={props.id}
        unstyled
        classNames={reactSelectClassNames}
        defaultValue={getFlattenedOptions(props.args.options).find(
          (option) => option.value === props.value
        )}
        onChange={(newValue) => {
          setBackroadValue({ id: props.id, value: newValue?.value });
        }}
      />
    </div>
  );
};
