import { socket } from '../socket';
import { useEffect, useState } from 'react';
import type { BackroadContainer } from '@backroad/core';
import { TreeRender } from './tree';
import { Navbar } from './layout/navbar';
import { Footer } from './layout/footer';
const treeStruct: BackroadContainer<'base'> = {
  type: 'base',
  path: '',
  args: {},
  children: [
    {
      type: 'number_input',
      // value: 5,
      path: '0.0',
      args: {
        label: 'Enter Value',
        defaultValue: 5,
      },
      key: '0.0',
    },
    {
      type: 'button',
      // value: 5,
      path: '0.1',
      key: '0.1',
      args: {
        label: 'Submit',
        defaultValue: false,
      },
    },
    {
      type: 'markdown',
      path: '0.2',
      key: '0.2',
      args: {
        body: 5,
      },
    },
  ],
};
export function App() {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar connected={connected} />
      <div className="flex-1">
        <TreeRender tree={treeStruct} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
