import { cp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { build } from 'esbuild';

import {
  copyDirectoryContents,
  createTempDir,
  ensureCleanDir,
  readJson,
  run,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

const sourcePackageJson = await readJson('examples/demo/package.json');

await ensureCleanDir('dist/examples/demo');

await build({
  bundle: true,
  entryPoints: ['examples/demo/src/main.ts'],
  external: ['sharp', 'better-auth', 'better-sqlite3'],
  format: 'cjs',
  outfile: 'dist/examples/demo/main.js',
  platform: 'node',
  sourcemap: false,
  target: 'node24',
  tsconfig: 'examples/demo/tsconfig.json',
  absWorkingDir: workspaceRoot,
});

await copyDirectoryContents(
  'examples/demo/src/assets',
  'dist/examples/demo/assets'
);

const runtimeDeps = {
  sharp: sourcePackageJson.dependencies.sharp,
  'better-auth': sourcePackageJson.dependencies['better-auth'],
  'better-sqlite3': sourcePackageJson.dependencies['better-sqlite3'],
};

await writeJson('dist/examples/demo/package.json', {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  main: './main.js',
  type: 'commonjs',
  dependencies: runtimeDeps,
});

const lockfileDir = await createTempDir('demo-lockfile');
const lockfilePackageJson = {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  private: true,
  dependencies: runtimeDeps,
};

await writeFile(
  path.join(lockfileDir, 'package.json'),
  `${JSON.stringify(lockfilePackageJson, null, 2)}\n`
);

run('pnpm', ['install', '--lockfile-only', '--prod', '--ignore-scripts'], {
  cwd: lockfileDir,
});

await cp(
  path.join(lockfileDir, 'pnpm-lock.yaml'),
  path.join(workspaceRoot, 'dist/examples/demo/pnpm-lock.yaml')
);

await rm(lockfileDir, { force: true, recursive: true });
