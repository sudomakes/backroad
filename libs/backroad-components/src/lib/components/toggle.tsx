import { useState } from 'react';
import { BackroadComponentRenderer } from '../types/components';
import { setBackroadValue } from '../socket';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export const Toggle: BackroadComponentRenderer<'toggle'> = (props) => {
  const [value, setValue] = useState(props.value);
  return (
    <div className="flex items-center gap-3">
      <Switch
        id={props.id}
        checked={!!value}
        onCheckedChange={(checked) => {
          setValue(checked);
          setBackroadValue({ id: props.id, value: checked });
        }}
      />
      <Label htmlFor={props.id} className="flex-1 font-normal">
        {props.args.label}
      </Label>
    </div>
  );
};
