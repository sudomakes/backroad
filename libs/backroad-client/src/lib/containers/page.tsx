import { BackroadContainer } from 'backroad-core';
// import { TreeRender } from '../tree';
import { TreeRender } from '../tree';

export const _Page = (props: BackroadContainer<'page', true>) => {
  return (
    <div className="container overflow-auto mx-auto flex flex-col gap-3 lg:gap-5 p-3 lg:p-5 max-w-[900px]">
      {props.children.map((child) => {
        return <TreeRender tree={child} key={child.path} />;
      })}
    </div>
  );
};
