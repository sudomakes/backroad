import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';

export const Columns: BackroadContainerRenderer<'columns'> = (props) => {
  return (
    <div className="flex gap-1">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
