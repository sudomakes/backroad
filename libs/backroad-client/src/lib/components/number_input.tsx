import { BackroadComponent } from '@backroad/core';
import { useState } from 'react';
import { setBackroadValue } from '../socket';
import { handleKeyUpBlur } from '../helpers/handleKeyUp';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export const NumberInput = (props: BackroadComponent<'number_input', true>) => {
  const [inputValue, setInputValue] = useState(props.value);
  const stepValue = props.args.step || 1;
  const precisionValue = props.args.precision || 0;

  const getFormattedValue = (value: string) => {
    const operation = precisionValue > 0 ? parseFloat : parseInt;
    const formattedValue = (operation(value) || 0).toFixed(precisionValue);
    return operation(formattedValue);
  };
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="backroad-label">{props.args.label}</span>
      </label>
      <label className="input-group">
        <input
          type="number"
          min={props.args.min}
          max={props.args.max}
          step={props.args.step}
          value={inputValue}
          onChange={(e) => setInputValue(getFormattedValue(e.target.value))}
          placeholder="Type here"
          onKeyUp={handleKeyUpBlur}
          onBlur={(e) => {
            console.log('blur setting value');
            setBackroadValue({
              id: props.id,
              value: getFormattedValue(e.target.value),
            });
          }}
          className="input input-bordered w-full max-w-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span
          onClick={() => {
            const newValue = inputValue - stepValue;
            setInputValue(newValue);
            setBackroadValue({ id: props.id, value: newValue });
          }}
          className="cursor-pointer bg-secondary text-secondary-content hover:bg-secondary-focus hover:text-secondary-content"
        >
          <MinusIcon width={15} />
        </span>
        <span
          onClick={() => {
            const newValue = inputValue + stepValue;
            setInputValue(newValue);
            setBackroadValue({ id: props.id, value: newValue });
          }}
          className="cursor-pointer bg-secondary text-secondary-content hover:bg-secondary-focus hover:text-secondary-content"
        >
          <PlusIcon width={15} />
        </span>
      </label>
    </div>
  );
};
