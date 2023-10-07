import { BackroadContainer } from 'backroad-core';
import { TreeRender } from '../tree';

export const Base = (props: BackroadContainer<'base', true>) => {
  return (
    <div className="container mx-auto flex flex-col gap-3 lg:gap-5">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
