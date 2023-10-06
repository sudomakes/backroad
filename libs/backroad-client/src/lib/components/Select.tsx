import { useState } from 'react';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import ReactSelect from 'react-select';
export const Select: BackroadComponentRenderer<'select'> = (props) => {
  const [value, setValue] = useState(
    props.args.options?.find((option) => option.value === props.value)
  );
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.args.label || props.id}</span>
      </label>
      <ReactSelect
        {...props.args}
        defaultValue={value}
        onChange={(newValue) => {
          console.log('got this new value', newValue);
          setValue(newValue);
          setBackroadValue({ id: props.id, value: newValue.value });
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
