import { spawn } from 'node:child_process';
import path from 'node:path';

import { context } from 'esbuild';

import { workspaceRoot } from './helpers.mjs';

let serverProcess = null;

function stopServer() {
  if (!serverProcess) {
    return;
  }

  serverProcess.kill('SIGTERM');
  serverProcess = null;
}

function startServer() {
  stopServer();
  // The bundle externalizes better-auth / better-sqlite3 (kysely-adapter
  // doesn't bundle cleanly; sqlite is native). Node resolves modules from
  // the script's path upward, so add the example app's node_modules to
  // NODE_PATH so externals are reachable from dist/.
  const exampleNodeModules = path.join(
    workspaceRoot,
    'examples/demo/node_modules'
  );
  const nodePath = process.env.NODE_PATH
    ? `${exampleNodeModules}${path.delimiter}${process.env.NODE_PATH}`
    : exampleNodeModules;
  serverProcess = spawn(process.execPath, ['dist/examples/demo/main.js'], {
    cwd: workspaceRoot,
    env: { ...process.env, NODE_PATH: nodePath },
    stdio: 'inherit',
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`demo exited with code ${code}`);
    }
    if (signal && signal !== 'SIGTERM') {
      console.error(`demo exited with signal ${signal}`);
    }
  });
}

const buildContext = await context({
  absWorkingDir: workspaceRoot,
  bundle: true,
  entryPoints: ['examples/demo/src/main.ts'],
  external: ['sharp', 'better-auth', 'better-sqlite3'],
  format: 'cjs',
  outfile: 'dist/examples/demo/main.js',
  platform: 'node',
  sourcemap: true,
  target: 'node24',
  tsconfig: 'examples/demo/tsconfig.json',
  plugins: [
    {
      name: 'restart-demo',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length > 0) {
            return;
          }

          startServer();
        });
      },
    },
  ],
});

await buildContext.watch();

const shutdown = async () => {
  stopServer();
  await buildContext.dispose();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
