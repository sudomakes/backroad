import { BackroadComponentRenderer } from '../types/components';
import ReactJson from 'react-json-view';

export const Json: BackroadComponentRenderer<'json'> = (props) => {
  return <ReactJson src={props.args.src} theme="hopscotch" collapsed={false} />;
};
