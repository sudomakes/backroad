import {
  getInitialTreeStructure,
  type BackroadContainer,
  type BackroadNode
} from '@backroad/core';
import { TreeRender, socket } from 'backroad-client';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes } from 'react-router-dom';
import superjson from 'superjson';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';
import useBackroadConfig from './hooks/useBackroadConfig';
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

  const config = useBackroadConfig();
  useEffect(() => {
    if (config?.analytics?.google) {
      ReactGA.initialize(config.analytics.google);
    }
  }, [config?.analytics?.google]);

  useEffect(() => {
    const onRender = (nodeData: string[], callback: () => void) => {
      setTreeStruct((oldTreeStruct) => {
        let newTree = JSON.parse(
          JSON.stringify(oldTreeStruct)
        ) as BackroadContainer<'base', true>;
        nodeData.forEach((node) => {
          const parsedNode = superjson.parse(node) as BackroadNode<true, true>;
          if (parsedNode.path == "") {
            // basically means a full reset
            newTree = parsedNode as BackroadContainer<'base', true>;
          } else {
            newTree = set(newTree, parsedNode.path, parsedNode);
          }
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
      <div id="sidebar-portal" className="relative h-screen"></div>
      <div className="flex-1 relative flex flex-col">
        <Navbar connected={connected} />
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
