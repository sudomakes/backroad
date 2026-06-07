import { Helmet } from 'react-helmet';
import { BackroadComponentRenderer } from '../types/components';
export const Title: BackroadComponentRenderer<'title'> = (props) => {
  return (
    <Helmet>
      <title>{props.args.label}</title>
    </Helmet>
  );
};
