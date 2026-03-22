import { spawn } from 'node:child_process';

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
  serverProcess = spawn(
    process.execPath,
    ['dist/apps/backroad-example/main.js'],
    {
      cwd: workspaceRoot,
      env: process.env,
      stdio: 'inherit',
    }
  );

  serverProcess.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`backroad-example exited with code ${code}`);
    }
    if (signal && signal !== 'SIGTERM') {
      console.error(`backroad-example exited with signal ${signal}`);
    }
  });
}

const buildContext = await context({
  absWorkingDir: workspaceRoot,
  bundle: true,
  entryPoints: ['apps/backroad-example/src/main.ts'],
  external: ['sharp'],
  format: 'cjs',
  outfile: 'dist/apps/backroad-example/main.js',
  platform: 'node',
  sourcemap: true,
  target: 'node20',
  tsconfig: 'apps/backroad-example/tsconfig.json',
  plugins: [
    {
      name: 'restart-backroad-example',
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
