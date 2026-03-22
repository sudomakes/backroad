import path from 'node:path';
import { rm } from 'node:fs/promises';

import {
  copyDirectoryContents,
  publishTagForVersion,
  readJson,
  run,
  validateVersion,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

const version = process.env.VERSION;
validateVersion(version);

const packageFiles = [
  'package.json',
  'libs/backroad/package.json',
  'libs/backroad-core/package.json',
];

for (const packageFile of packageFiles) {
  const packageJson = await readJson(packageFile);
  packageJson.version = version;
  await writeJson(packageFile, packageJson);
}

run('pnpm', ['--filter', 'client', 'run', 'build']);
run('pnpm', ['--filter', '@backroad/core', 'run', 'build']);
run('pnpm', ['--filter', '@backroad/backroad', 'run', 'build']);

await rm(path.join(workspaceRoot, 'dist/libs/backroad/src/lib/server/public'), {
  force: true,
  recursive: true,
});
await copyDirectoryContents(
  'dist/apps/client',
  'dist/libs/backroad/src/lib/server/public'
);

const tag = publishTagForVersion(version);

run('node', [
  'tools/scripts/publish-package.mjs',
  'dist/libs/backroad-core',
  tag,
]);
run('node', ['tools/scripts/publish-package.mjs', 'dist/libs/backroad', tag]);
