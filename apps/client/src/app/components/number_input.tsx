import { ComponentPropsMapping } from '@backroad/core';
import { useState } from 'react';

export const NumberInput = (props: ComponentPropsMapping['number_input']) => {
  const [value, setValue] = useState(props.value);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.args.label}</span>
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};
