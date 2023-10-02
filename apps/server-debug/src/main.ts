import { startBackroadServer } from 'backroad';
// import path from 'path';

// for debugging and booting the server without cli
if (process.env['NX_TASK_TARGET_TARGET'] === 'serve') {
  console.log('using test script', process.cwd());
  startBackroadServer({
    // scriptPath: `C:\\Users\\vachopra\\code\\backroad\\test-script.ts`,
    //path.join(__dirname, "./test-script.ts")
  });
}
