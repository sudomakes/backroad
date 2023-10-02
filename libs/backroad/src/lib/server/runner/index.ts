// import childProcess from 'child_process';
// import path from 'path';

// import { BackroadSession } from '../sessions/session';

// export const getBackroadScriptRunner = (props: {
//   scriptPath: string;
//   envVariables: {
//     BACKROAD_SESSION: string;
//     BACKROAD_SERVER_PORT: string;
//   };
// }) => {
//   const scriptProcess = childProcess.spawn(
//     `npx`,
//     [`-y`, `tsx`, `${props.scriptPath}`],
//     {
//       shell: true,
//       cwd: path.dirname(props.scriptPath),
//       env: {
//         ...process.env,
//         ...props.envVariables,
//         ESBK_TSCONFIG_PATH: path.join(process.cwd(), 'tsconfig.base.json'),
//       },
//     }
//   );

//   scriptProcess.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//   scriptProcess.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
//   });

//   scriptProcess.on('error', (err) => {
//     console.log('error', err);
//   });
//   scriptProcess.on('message', (message) => {
//     console.log('message', message);
//   });
//   scriptProcess.on('exit', function (code, signal) {
//     console.log(
//       'child process exited with ' + `code ${code} and signal ${signal}`
//     );
//   });

//   return scriptProcess;
// };

// const getCancellableRunner = (runner:Promise,session:BackroadSession)
