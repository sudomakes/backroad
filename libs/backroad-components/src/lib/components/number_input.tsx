import { BackroadComponent } from '@backroad/core';
import { useState } from 'react';
import { setBackroadValue } from '../socket';
import { handleKeyUpBlur } from '../helpers/handleKeyUp';
import { Minus, Plus } from 'lucide-react';
import { Input, Label, Button } from 'backroad-ui';

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
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={props.id}>{props.args.label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={props.id}
          type="number"
          min={props.args.min}
          max={props.args.max}
          step={props.args.step}
          value={inputValue}
          onChange={(e) => setInputValue(getFormattedValue(e.target.value))}
          placeholder="Type here"
          onKeyUp={handleKeyUpBlur}
          onBlur={(e) => {
            setBackroadValue({
              id: props.id,
              value: getFormattedValue(e.target.value),
            });
          }}
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Decrement"
          onClick={() => {
            const newValue = inputValue - stepValue;
            setInputValue(newValue);
            setBackroadValue({ id: props.id, value: newValue });
          }}
        >
          <Minus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Increment"
          onClick={() => {
            const newValue = inputValue + stepValue;
            setInputValue(newValue);
            setBackroadValue({ id: props.id, value: newValue });
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
};
