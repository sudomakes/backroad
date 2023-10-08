import ReactSelect from 'react-select';
import { getFlattenedOptions } from '../helpers/select';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { useState } from 'react';
import { SelectOptionType } from '@backroad/core';
export const Multiselect: BackroadComponentRenderer<'multiselect'> = (
  props
) => {
  const flattenedOptions = getFlattenedOptions(props.args.options);
  const valueOptions = flattenedOptions.filter((option) =>
    props.value?.includes(option.value)
  ) as Readonly<SelectOptionType[]>;
  const [value, setValue] = useState(valueOptions);
  // const defaultValue = props.args.options.find((option) => option.value === props.value)
  //   const [value, setValue] = useState(
  //     // props.args.options?.flat()?.find((option) => option.value ===
  //     props.value
  //     // )
  //   );
  // const selectedOptions =
  //   const flattenedOptions = getFlattenedOptions(props.args.options);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.args.label || props.id}</span>
      </label>
      {/* <ReactSelect options={[{ value: 'abc', label: 'string' }]} /> */}
      <ReactSelect
        {...props.args}
        defaultValue={value}
        isMulti
        onChange={(newValue) => {
          console.log('got this new value', newValue);
          setValue(newValue);
          setBackroadValue({
            id: props.id,
            value: newValue?.map((option) => option.value),
          });
        }}
      />
      {/* <select
        className="select select-bordered"
        onChange={(e) => {
          // setValue(e.target.value);
          setBackroadValue({ id: props.id, value: e.target.value });
        }}
        // value={ value}
      >
        <option disabled selected>
          Pick one
        </option>
        {props.args.options.map((option) => {
          return (
            <option value={option}>
              {props.args.formatOption
                ? props.args.formatOption(option)
                : option.toString()}
            </option>
          );
        })}
      </select> */}
      {/* <label className="label">
        <span className="label-text-alt">Alt label</span>
        <span className="label-text-alt">Alt label</span>
      </label> */}
    </div>
  );
};
