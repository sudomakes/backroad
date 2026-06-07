import { BackroadComponentRenderer } from '../types/components';

export const LoadingSpinner: BackroadComponentRenderer<'loading_spinner'> = (
  props
) => {
  const { fontSize, top, left } = props.args;
  return <span style={{ fontSize, top, left }} className="loader"></span>;
};
