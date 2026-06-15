import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';

// The dock half of the frame/dock pair. The page (see `Page`) renders any
// `bottom` children here, outside the scrolling message body, so the chat input
// stays pinned to the bottom while bubbles grow and the log scrolls above it.
export const Bottom: BackroadContainerRenderer<'bottom'> = (props) => {
  return (
    <div className="shrink-0 flex flex-col gap-3 border-t border-border bg-background px-3 pb-4 pt-3 lg:px-5">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
