import { TreeRender, socket } from 'backroad-client';
import {
  getInitialTreeStructure,
  type BackroadContainer,
  type BackroadNode,
} from 'backroad-core';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import superjson from 'superjson';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line @nx/enforce-module-boundaries
// TODO: move all this stuff to a lib
export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<BackroadContainer<'base', true>>(
    getInitialTreeStructure()
  );

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('sending run script request');
      socket.emit('run_script', undefined, () => {
        console.log('ran script');
      });
    });
    socket.on('disconnect', () => setConnected(false));
  });

  useEffect(() => {
    const onRender = (nodeData: string[], callback: () => void) => {
      setTreeStruct((oldTreeStruct) => {
        let newTree = JSON.parse(
          JSON.stringify(oldTreeStruct)
        ) as BackroadContainer<'base', true>;
        nodeData.forEach((node) => {
          const parsedNode = superjson.parse(node) as BackroadNode<true, true>;
          newTree = set(newTree, parsedNode.path, parsedNode);
        });
        console.log('new tree', newTree);
        return newTree; // need to update the object ref by destructuring to trigger a rerender
      });
      callback();
    };
    socket.on('render', onRender);
    return () => {
      socket.off('render', onRender);
    };
  });

  console.log('pages data', treeStruct);
  return (
    <div className="flex min-h-screen">
      {/* <Helmet defaultTitle="Backroad App" /> */}
      <div id="sidebar-portal" className="relative"></div>
      <div className="flex-1">
        <Navbar connected={connected} />
        {/* {JSON.stringify(treeStruct)} */}
        <Routes>
          {treeStruct.children.map((pageContainer) => {
            const castedPageContainer = pageContainer as BackroadContainer<
              'page',
              true
            >;
            console.log('renderer going into render', castedPageContainer);
            return (
              <Route
                path={castedPageContainer.args.path}
                key={castedPageContainer.args.path}
                element={
                  <TreeRender
                    tree={{ ...castedPageContainer, type: 'page', args: {} }}
                  />
                }
              />
            );
          })}
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
