import { BackroadComponentRenderer } from '../types/components';

export const Iframe: BackroadComponentRenderer<'iframe'> = (props) => {
  const { title, ...rest } = props.args;
  return <iframe title={title} {...rest} />;
};
