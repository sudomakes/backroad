import { BackroadComponentRenderer } from '../types/components';

export const Markdown: BackroadComponentRenderer<'markdown'> = (props) => {
  return <div>{props.args.body}</div>;
};
