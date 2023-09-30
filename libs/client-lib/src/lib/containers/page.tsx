import { BackroadContainer } from 'backroad-core';
// import { TreeRender } from '../tree';
import { Base } from './base';
import { Route, Routes } from 'react-router-dom';

export const Page = (props: BackroadContainer<'page', true>) => {
  return (
    <Routes>
      <Route
        path={props.path}
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
    </Routes>
    // <div className="container mx-auto flex flex-col gap-3 max-w-[600px]">
    //   {props.children.map((child) => {
    //     return <TreeRender tree={child} key={child.path} />;
    //   })}
    // </div>
  );
};
