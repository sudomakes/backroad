import {
  getInitialTreeStructure,
  type BackroadContainer,
  type BackroadNode,
} from '@backroad/core';
import { TreeRender, socket } from 'backroad-components';
import { Toaster } from 'backroad-ui';
import { set } from 'lodash';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes, useLocation } from 'react-router-dom';
import superjson from 'superjson';
import { Navbar } from './layout/navbar';
import useBackroadConfig from './hooks/useBackroadConfig';
import { useTheme } from './theme/theme-provider';
import type { ThemeName } from './theme/themes';

// Code-split the auth bundle. @daveyplate/better-auth-ui plus its Radix /
// shadcn deps add ~160KB gzipped to the JS bundle; we only need them on
// the /signin/* routes, so React.lazy keeps them out of every other page
// view.
const AuthRoute = lazy(() => import('./auth/signin'));

// Asks the server to (re)run the script for the given path. The server has no
// path state of its own, so the run is what carries currentPath to it.
//
// Two things must trigger a run, and both reduce to "we're connected and the
// path is known":
//   - (re)connect — `connected` flips true (initial load, or after a drop)
//   - in-app navigation — React Router <Link> changes the URL client-side with
//     no socket round-trip, so only `pathname` changes
//
// Gating on `connected` (which starts false) means mounting alone never emits,
// so there's no duplicate initial run to guard against.
function useRunScript(connected: boolean, pathname: string) {
  useEffect(() => {
    if (!connected) return;
    socket.emit('run_script', { pathname }, () => undefined);
  }, [connected, pathname]);
}

export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<BackroadContainer<'base', true>>(
    getInitialTreeStructure()
  );
  // Highest runId whose render patch we've applied. Patches arriving with a
  // lower runId belong to a superseded run and are ignored. -1 so the first
  // run (runId 1) is always accepted; reset on remount, which is fine because a
  // remount also resets treeStruct to the initial structure.
  const lastRunIdRef = useRef(-1);
  // Keep `connected` in sync with the socket (drives the Navbar indicator).
  // `socket` is a module-level singleton — it may already be connected by the
  // time this mounts (especially with the larger better-auth-ui bundle), so
  // seed from `socket.connected` to avoid sitting on "Disconnected" forever
  // after a missed `connect` event.
  useEffect(() => {
    if (socket.connected) setConnected(true);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const location = useLocation();
  useRunScript(connected, location.pathname);

  const config = useBackroadConfig();
  useEffect(() => {
    if (config?.analytics?.google) {
      ReactGA.initialize(config.analytics.google);
    }
  }, [config?.analytics?.google]);

  // Seed the app-maker's recommended palette + mode from the config once it
  // arrives. seedDefaults only applies when the user has no saved preference
  // (localStorage wins) and never persists, so a past user choice is never
  // clobbered on reload.
  const { seedDefaults } = useTheme();
  const appearance = config?.appearance;
  useEffect(() => {
    if (appearance) {
      seedDefaults({
        theme: appearance.theme as ThemeName | undefined,
        mode: appearance.mode,
      });
    }
  }, [appearance, seedDefaults]);

  useEffect(() => {
    const onRender = (
      { nodes, runId }: { nodes: string[]; runId: number },
      callback: () => void
    ) => {
      // Drop patches from a superseded run. Node paths carry absolute child
      // indices that are only contiguous within a single run, so applying a
      // stale patch on top of a freshly-reset tree would punch holes in the
      // children arrays (which then serialize to `null` and crash the renderer).
      if (runId < lastRunIdRef.current) {
        callback();
        return;
      }
      lastRunIdRef.current = runId;
      setTreeStruct((oldTreeStruct) => {
        // structuredClone (not JSON round-trip): if a hole ever does slip into a
        // children array, this preserves it as a hole — which .map/.filter skip
        // — instead of materializing it into a `null` the renderer would deref.
        let newTree = structuredClone(oldTreeStruct) as BackroadContainer<
          'base',
          true
        >;
        nodes.forEach((node) => {
          const parsedNode = superjson.parse(node) as BackroadNode<true, true>;
          if (parsedNode.path == '') {
            // basically means a full reset
            newTree = parsedNode as BackroadContainer<'base', true>;
          } else {
            newTree = set(newTree, parsedNode.path, parsedNode);
          }
        });
        return newTree; // new object ref triggers a rerender
      });
      callback();
    };
    socket.on('render', onRender);
    return () => {
      socket.off('render', onRender);
    };
  }, []);

  console.log('pages data', treeStruct);
  const nonPageChildren = treeStruct.children.filter((c) => c.type !== 'page');
  const pageChildren = treeStruct.children.filter((c) => c.type === 'page');

  return (
    <div className="flex min-h-screen">
      {/* App-root toast outlet — br.toast() fires notifications into this. */}
      <Toaster position="top-right" />
      <div id="sidebar-portal" className="relative h-screen"></div>
      {/* Non-page root children (e.g. sidebar) stay mounted across all routes */}
      {nonPageChildren.map((child) => (
        <TreeRender tree={child} key={child.path} />
      ))}
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
          {pageChildren.map((pageContainer) => {
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
