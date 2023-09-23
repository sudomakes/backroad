import { startBackroadServer } from '@backroad/server';
// import path from 'path';

// for debugging and booting the server without cli
if (process.env['NX_TASK_TARGET_TARGET'] === 'serve') {
  console.log('using test script', process.cwd());
  startBackroadServer({
    scriptPath: `C:\\Users\\vachopra\\code\\backroad\\apps\\server-debug\\src\\test-script.ts`,
    //path.join(__dirname, "./test-script.ts")
  });
}
