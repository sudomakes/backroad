import type { BackroadNode } from 'backroad-core';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';
import superjson from 'superjson';
import { TreeRender, socket } from '@backroad/client-lib';
// eslint-disable-next-line @nx/enforce-module-boundaries
// TODO: move all this stuff to a lib
export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<BackroadNode<true>>({
    type: 'base',
    path: '',
    args: {},
    children: [],
  });

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
      console.log('received render order for', nodeData);
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
    <div className="flex flex-col min-h-screen">
      <Navbar connected={connected} />
      <div className="flex-1">
        <TreeRender tree={treeStruct} />
      </div>
      {/* <LineChart
        args={{ defaultValue: undefined }}
        path=""
        id=""
        type="line_chart"
        value={null}
      /> */}
      <Footer />
    </div>
  );
}

export default App;
