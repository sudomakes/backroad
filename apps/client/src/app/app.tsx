// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { socket } from '../socket';
import { useEffect, useState } from 'react';
import styles from './app.module.scss';

// import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const [connected,setConnected] = useState(false)
  useEffect(()=>{
    fetch('/api').then(res=>res.json()).then(console.log)
    socket.on('connect', ()=>setConnected(true));
    socket.on('disconnect', ()=>setConnected(false));
  })
  return (
    <div>
      {/* <NxWelcome title="client" /> */}

      <br />
      <h1>
        {connected ? 'Connected' : 'Disconnected'}
      </h1>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
