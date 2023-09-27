import { socket } from '../socket';
import { useEffect, useState } from 'react';
import type {
  BackroadContainer,
  BackroadNode,
  InbuiltContainerTypes,
} from 'backroad-core';
import { TreeRender } from './tree';
import { Navbar } from './layout/navbar';
import { Footer } from './layout/footer';
import { set } from 'lodash';
export function App() {
  const [connected, setConnected] = useState(false);
  const [treeStruct, setTreeStruct] = useState<
    BackroadContainer<InbuiltContainerTypes>
  >({
    type: 'base',
    path: '',
    args: {},
    children: [],
  });


  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
  });

  useEffect(()=>{
    const onRender = (node: BackroadNode, callback:()=>void) => {
      console.log('received render order for', node);
      setTreeStruct((oldTreeStruct) => {
        const newTree = set(oldTreeStruct, node.path, node);
        console.log('new tree value', newTree);
        return { ...newTree }; // need to update the object ref by destructuring to trigger a rerender
      });
      callback();
    }
    socket.on('render',onRender);

    return ()=>{
      socket.off('render',onRender);
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar connected={connected} />
      <div className="flex-1">
        {/* {JSON.stringify(treeStruct)} */}
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
        {/* @ts-ignore  */}
        <TreeRender tree={treeStruct} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
