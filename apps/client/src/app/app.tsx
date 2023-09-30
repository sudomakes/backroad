import { TreeRender, socket } from '@backroad/client-lib';
import type { BackroadContainer, BackroadNode } from 'backroad-core';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import superjson from 'superjson';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';
import { Route, Routes } from 'react-router-dom';
// eslint-disable-next-line @nx/enforce-module-boundaries
// TODO: move all this stuff to a lib
export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<BackroadContainer<'base', true>>(
    {
      type: 'base',
      path: '',
      args: {},
      children: [
        { type: 'page', path: 'children.0', args: { path: '/' }, children: [] },
      ],
    }
  );

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('run_script', undefined, () => {
        console.log('ran script');
      });
    });
    socket.on('disconnect', () => setConnected(false));
  });

  useEffect(() => {
    const onRender = (nodeData: string, callback: () => void) => {
      // console.log('received render order for', nodeData);
      setTreeStruct((oldTreeStruct) => {
        const node = superjson.parse(nodeData) as BackroadNode<true, true>;
        const newTree = set(oldTreeStruct, node.path, node);
        console.log('new tree value', newTree);
        return { ...newTree }; // need to update the object ref by destructuring to trigger a rerender
      });
      callback();
    };
    socket.on('render', onRender);
    return () => {
      socket.off('render', onRender);
    };
  });

  return (
    <div className="flex min-h-screen">
      <div id="menu-portal" className="relative"></div>
      <div className="flex-1">
        <Navbar connected={connected} />
        <Routes>
          {treeStruct.children.map((pageContainer) => {
            const castedPageContainer = pageContainer as BackroadContainer<
              'page',
              true
            >;
            return (
              <Route
                path={castedPageContainer.args.path}
                element={
                  <TreeRender
                    tree={{ ...castedPageContainer, type: 'base', args: {} }}
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
