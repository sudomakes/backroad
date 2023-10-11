import { setRunUnsetBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';

export const Button: BackroadComponentRenderer<"button"> = (props) => {
  return <button className="btn" onClick={() => {
    setRunUnsetBackroadValue({ id: props.id, value: true })
  }}>{props.args.label}</button>;
};
