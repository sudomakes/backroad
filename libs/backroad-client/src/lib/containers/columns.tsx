import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';

export const Columns: BackroadContainerRenderer<'columns'> = (props) => {
  return (
    <div className="md:grid gap-1" style={{
      gridTemplateColumns: (typeof props.args.columns === "number" ? [...Array(props.args.columns)].map(_ => "1fr") : props.args.columns.map(ratio => `${ratio}fr`)).join(" ")

    }}>
      {
        props.children.map((child) => {
          return <TreeRender tree={child} key={child.path} />;
        })
      }
    </div >
  );
};
