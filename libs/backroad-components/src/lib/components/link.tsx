import { BackroadComponentRenderer } from '../types/components';
import { Link as RouterLink } from 'react-router-dom';
export const Link: BackroadComponentRenderer<'link'> = (props) => {
  return (
    <RouterLink to={props.args.href} className={'link'}>
      {props.args.label}
    </RouterLink>
  );
};
