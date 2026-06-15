import ReactSelect from 'react-select';
import { getFlattenedOptions, reactSelectClassNames } from '../helpers/select';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { useState } from 'react';
import { SelectOptionType } from '@backroad/core';
import { Label } from 'backroad-ui';
export const Multiselect: BackroadComponentRenderer<'multiselect'> = (
  props
) => {
  const flattenedOptions = getFlattenedOptions(props.args.options);
  const valueOptions = flattenedOptions.filter((option) =>
    props.value?.includes(option.value)
  ) as Readonly<SelectOptionType[]>;
  const [value, setValue] = useState(valueOptions);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label || props.id}</Label>
      <ReactSelect
        {...props.args}
        inputId={props.id}
        unstyled
        classNames={reactSelectClassNames}
        defaultValue={value}
        isMulti
        onChange={(newValue) => {
          setValue(newValue);
          setBackroadValue({
            id: props.id,
            value: newValue?.map((option) => option.value),
          });
        }}
      />
    </div>
  );
};
