import { Link } from 'react-router-dom';
import { BackroadComponentRenderer } from '../types/components';

export const LinkGroup: BackroadComponentRenderer<'link_group'> = (props) => {
  return (
    <div className="join join-vertical">
      {props.args.items.map((item) => {
        return (
          <Link to={item.href} target={item.target}>
            <div className="p-4 hover:bg-base-300 font-medium">
              {item.label || item.href.replace(/\//, ' ').trim()}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
