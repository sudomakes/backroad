import { socket } from '../socket';
import { useEffect, useState } from 'react';
// import { RoutesDemo } from './routes';
import type { BackroadContainer } from '@backroad/core';
import { TreeRender } from './tree';
import { Navbar } from './layout/navbar';
import { Footer } from './layout/footer';
const treeStruct: BackroadContainer = {
  type: 'base',
  path: '',
  args: {},
  children: [
    {
      type: 'number_input',
      value: 5,
      path: '0.0',
      args: {
        label: 'Enter Value',
      },
    },
    {
      type: 'button',
      value: 5,
      path: '0.1',
      args: {
        label: 'Submit',
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
      <Navbar />
      <div className="flex-1">
        <TreeRender tree={treeStruct} />
        <div className="container mx-auto mt-3">10</div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
