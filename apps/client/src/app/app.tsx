import { socket } from '../socket';
import { useEffect, useState } from 'react';
// import { RoutesDemo } from './routes';

export function App() {
  const [connected,setConnected] = useState(false)
  useEffect(()=>{
    socket.on('connect', ()=>setConnected(true));
    socket.on('disconnect', ()=>setConnected(false));

    socket.on("data",(args)=>{
      document.querySelector('#backroad-main')?.insertAdjacentHTML('beforeend',args)
    })
  })
  return (
    <div>
      <h1  >
        {connected ? 'Connected' : 'Disconnected'}
      </h1>
      <button className="btn" onClick={()=>{
        console.log("running script")
        socket.emit('run_script')
      }}>Run Script</button>
      {/* <RoutesDemo/> */}
      <div id='backroad-main'></div>
    </div>
  );
}

export default App;
