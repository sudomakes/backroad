import { BackroadComponentRenderer } from '../types/components';

export const Image: BackroadComponentRenderer<'image'> = (props) => {
  return <img src={props.args.src} alt={props.args.alt} />;
};
