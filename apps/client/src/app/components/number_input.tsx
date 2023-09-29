import { BackroadComponent } from 'backroad-core';
import { useState } from 'react';
import { setValue } from '../../socket';

export const NumberInput = (props: BackroadComponent<'number_input', true>) => {
  const [inputValue, setInputValue] = useState(props.value);
  console.log('num input value', inputValue);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.args.label}</span>
      </label>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(parseInt(e.target.value))}
        placeholder="Type here"
        onBlur={(e) => {
          console.log('blur setting value');
          setValue({
            id: props.id,
            value: parseInt(e.target.value),
          });
        }}
        className="input input-bordered w-full max-w-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
};
