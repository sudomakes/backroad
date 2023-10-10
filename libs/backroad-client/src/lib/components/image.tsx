import { BackroadComponentRenderer } from '../types/components';

export const Image: BackroadComponentRenderer<'image'> = (props) => {
  return <img {...props.args} />;
};
