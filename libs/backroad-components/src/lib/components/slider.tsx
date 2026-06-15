import { useState } from 'react';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Label, Slider as SliderPrimitive } from 'backroad-ui';

// Radix Slider. A drag fires `onValueChange` on every tick — committing each
// would trigger a full script rerun per pixel — so local state tracks the live
// position and we only commit on `onValueCommit` (pointer release / keyboard
// nudge). Radix carries the ARIA slider semantics; the visible number mirrors
// the thumb for sighted users.
export const Slider: BackroadComponentRenderer<'slider'> = (props) => {
  const { label, min = 0, max = 100, step = 1 } = props.args;
  const [value, setValue] = useState(props.value);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={props.id}>{label}</Label>
        <span className="text-sm font-medium tabular-nums text-foreground">
          {value}
        </span>
      </div>
      <SliderPrimitive
        id={props.id}
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => setValue(next[0])}
        onValueCommit={(next) =>
          setBackroadValue({ id: props.id, value: next[0] })
        }
      />
    </div>
  );
};
