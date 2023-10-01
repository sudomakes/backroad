// import { useState } from 'react';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';

export const Select: BackroadComponentRenderer<'select'> = (props) => {
  // const [value, setValue] = useState(props.value);
  // const formatter =props.args.formatOption
  // ? props.args.formatOption
  // : (v:any)=>v.toString()
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.args.label || props.id}</span>
      </label>
      <select
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
      </select>
      {/* <label className="label">
        <span className="label-text-alt">Alt label</span>
        <span className="label-text-alt">Alt label</span>
      </label> */}
    </div>
  );
};
