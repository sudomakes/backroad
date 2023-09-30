import { BackroadContainer } from 'backroad-core';
// import { TreeRender } from '../tree';
import { Route } from 'react-router-dom';
import { Base } from './base';

// this is a special container, and should never be present
// at any point in the tree, apart from the root
// TreeRenderer should never render this recursively
// we manually render each page in app.tsx by iterating over each page
export const _Page = (props: BackroadContainer<'page', true>) => {
  return (
    // <Routes>
    <Route
      path={props.args.path}
      element={
        <Base
          {...{
            args: {},
            children: props.children,
            type: 'base',
            path: props.path,
          }}
        />
      }
    />
    // </Routes>
    // <div className="container mx-auto flex flex-col gap-3 max-w-[600px]">
    //   {props.children.map((child) => {
    //     return <TreeRender tree={child} key={child.path} />;
    //   })}
    // </div>
  );
};
