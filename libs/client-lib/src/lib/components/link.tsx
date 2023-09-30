import { BackroadComponentRenderer } from '../types/components';
import { Link as RouterLink } from 'react-router-dom';
export const Link: BackroadComponentRenderer<'link'> = (props) => {
  return (
    <RouterLink {...props.args} className={props.args.className || 'link'}>
      {props.args.label}
    </RouterLink>
  );
};
