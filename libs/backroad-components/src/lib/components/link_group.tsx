import { Link } from 'react-router-dom';
import { BackroadComponentRenderer } from '../types/components';

export const LinkGroup: BackroadComponentRenderer<'link_group'> = (props) => {
  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
      {props.args.items.map((item) => {
        return (
          <Link to={item.href} key={item.href} target={item.target}>
            <div className="p-4 font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              {item.label || item.href.replace(/\//, ' ').trim()}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
