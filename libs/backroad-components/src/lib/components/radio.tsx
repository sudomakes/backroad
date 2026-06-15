import { useState } from 'react';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { RadioGroup, RadioGroupItem, Label } from 'backroad-ui';

export const Radio: BackroadComponentRenderer<'radio'> = (props) => {
  const [value, setValue] = useState(props.value);
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <span className="backroad-label">{props.args.label}</span>
      <RadioGroup
        value={value ?? undefined}
        onValueChange={(option) => {
          setValue(option);
          setBackroadValue({ id: props.id, value: option });
        }}
      >
        {props.args.options.map((option) => (
          <div className="flex items-center gap-2" key={option}>
            <RadioGroupItem value={option} id={`${props.id}-${option}`} />
            <Label htmlFor={`${props.id}-${option}`} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
