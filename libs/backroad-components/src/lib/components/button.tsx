import { setRunUnsetBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { Button as UIButton } from 'backroad-ui';

export const Button: BackroadComponentRenderer<'button'> = (props) => {
  return (
    <UIButton
      onClick={() => {
        setRunUnsetBackroadValue({ id: props.id, value: true });
      }}
    >
      {props.args.label}
    </UIButton>
  );
};
