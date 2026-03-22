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

const sourcePackageJson = await readJson('apps/backroad-example/package.json');

await ensureCleanDir('dist/apps/backroad-example');

await build({
  bundle: true,
  entryPoints: ['apps/backroad-example/src/main.ts'],
  external: ['sharp'],
  format: 'cjs',
  outfile: 'dist/apps/backroad-example/main.js',
  platform: 'node',
  sourcemap: false,
  target: 'node20',
  tsconfig: 'apps/backroad-example/tsconfig.json',
  absWorkingDir: workspaceRoot,
});

await copyDirectoryContents(
  'apps/backroad-example/src/assets',
  'dist/apps/backroad-example/assets'
);

await writeJson('dist/apps/backroad-example/package.json', {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  main: './main.js',
  type: 'commonjs',
  dependencies: {
    sharp: sourcePackageJson.dependencies.sharp,
  },
});

const lockfileDir = await createTempDir('backroad-example-lockfile');
const lockfilePackageJson = {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  private: true,
  dependencies: {
    sharp: sourcePackageJson.dependencies.sharp,
  },
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
  path.join(workspaceRoot, 'dist/apps/backroad-example/pnpm-lock.yaml')
);

await rm(lockfileDir, { force: true, recursive: true });
