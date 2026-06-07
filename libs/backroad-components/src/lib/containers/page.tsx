import { BackroadContainer } from '@backroad/core';
// import { TreeRender } from '../tree';
import { TreeRender } from '../tree';

export const _Page = (props: BackroadContainer<'page', true>) => {
  return (
    <div className="container mx-auto flex flex-1 flex-col gap-3 lg:gap-5 px-3 py-[100px] lg:px-5 max-w-[900px]">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
