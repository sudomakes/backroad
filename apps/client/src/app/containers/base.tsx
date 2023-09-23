import { ContainerPropsMapping } from '@backroad/core';
import { TreeRender } from '../tree';

export const Base = (props: ContainerPropsMapping['base']) => {
  return (
    <div className="container mx-auto flex flex-col gap-3 max-w-[600px]">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
