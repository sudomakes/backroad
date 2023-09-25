import { IServerSocketEventHandler } from './base';
import childProcess from 'child_process';
import path from 'path';
import { BackroadSession } from '../sessions/session';

export const runScript: IServerSocketEventHandler<{
  serverPort: number;
  scriptPath: string;
  backroadSession: BackroadSession;
}> = (socket, options) => () => {
  console.log('running script', options.scriptPath, 'connectionCount');
  const scriptProcess = childProcess.spawn(
    `npx`,
    [` -y tsx ${options.scriptPath}`],
    {
      shell: true,
      cwd: path.dirname(options.scriptPath),
      env: {
        // ...process.env,
        BACKROAD_SESSION: options.backroadSession.id,
        BACKROAD_SERVER_PORT: options.serverPort.toString(),
      },
    }
  );
  // const output = eval(ts.transpile(readFileSync(scriptPath).toString()))
  // console.log("here goes your output",output)
  scriptProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    socket.emit('data', data.toString());
  });
  scriptProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    // socket.emit('data', data.toString());
  });

  scriptProcess.on('error', (err) => {
    console.log('error', err);
  });
  scriptProcess.on('message', (message) => {
    console.log('message', message);
  });
  scriptProcess.on('exit', function (code, signal) {
    console.log(
      'child process exited with ' + `code ${code} and signal ${signal}`
    );
  });
};
