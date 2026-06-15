import {
  getInitialTreeStructure,
  type BackroadContainer,
  type BackroadNode,
} from '@backroad/core';
import { TreeRender, socket } from 'backroad-components';
import { set } from 'lodash';
import { lazy, Suspense, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes } from 'react-router-dom';
import superjson from 'superjson';
import { Navbar } from './layout/navbar';
import useBackroadConfig from './hooks/useBackroadConfig';
import { useTheme } from './theme/theme-provider';

// Code-split the auth bundle. @daveyplate/better-auth-ui plus its Radix /
// shadcn deps add ~160KB gzipped to the JS bundle; we only need them on
// the /signin/* routes, so React.lazy keeps them out of every other page
// view.
const AuthRoute = lazy(() => import('./auth/signin'));
export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<BackroadContainer<'base', true>>(
    getInitialTreeStructure()
  );
  useEffect(() => {
    // `socket` is a module-level singleton — connection may already be
    // established by the time this component mounts (especially with the
    // larger bundle now that better-auth-ui is included). Seed initial
    // state from `socket.connected` so we don't sit forever on
    // "Disconnected" after a missed `connect` event.
    if (socket.connected) {
      setConnected(true);
      socket.emit('run_script', undefined, () => undefined);
    }
    const onConnect = () => {
      setConnected(true);
      console.log('sending run script request');
      socket.emit('run_script', undefined, () => {
        console.log('ran script');
      });
    };
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const config = useBackroadConfig();
  useEffect(() => {
    if (config?.analytics?.google) {
      ReactGA.initialize(config.analytics.google);
    }
  }, [config?.analytics?.google]);

  // Seed the initial light/dark mode from `config.theme` once the config
  // arrives. Users can still change appearance in the settings panel.
  const { setMode } = useTheme();
  useEffect(() => {
    if (config?.theme) setMode(config.theme);
  }, [config?.theme, setMode]);

  useEffect(() => {
    const onRender = (nodeData: string[], callback: () => void) => {
      setTreeStruct((oldTreeStruct) => {
        let newTree = JSON.parse(
          JSON.stringify(oldTreeStruct)
        ) as BackroadContainer<'base', true>;
        nodeData.forEach((node) => {
          const parsedNode = superjson.parse(node) as BackroadNode<true, true>;
          if (parsedNode.path == '') {
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
          {/* Auth views (signin, signup, forgot-password, …) all live
              under /auth/* and are rendered by better-auth-ui inside a
              lazy chunk. */}
          <Route
            path="/auth"
            element={
              <Suspense fallback={null}>
                <AuthRoute />
              </Suspense>
            }
          />
          <Route
            path="/auth/:pathname"
            element={
              <Suspense fallback={null}>
                <AuthRoute />
              </Suspense>
            }
          />
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
      </div>
    </div>
  );
}

export default App;
