import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';

export const Columns: BackroadContainerRenderer<'columns'> = (props) => {
  return (
    <div className="flex">
      {props.children.map((child) => {
        return <TreeRender tree={child} />;
      })}
    </div>
  );
};
