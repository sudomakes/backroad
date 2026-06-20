import path from 'node:path';
import { rm } from 'node:fs/promises';

import {
  copyDirectoryContents,
  readJson,
  run,
  validateVersion,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

// PREPARE phase only: stamp versions + build the publishable artifacts.
// The actual `npm publish` lives in publish.mjs and runs in semantic-release's
// `publish` phase, so npm and the git tag stay in lockstep. See release.config.js.
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

run('pnpm', ['--filter', 'backroad-frontend', 'run', 'build']);
run('pnpm', ['--filter', '@backroad/core', 'run', 'build']);
run('pnpm', ['--filter', '@backroad/backroad', 'run', 'build']);

await rm(path.join(workspaceRoot, 'dist/libs/backroad/src/lib/server/public'), {
  force: true,
  recursive: true,
});
await copyDirectoryContents(
  'dist/libs/backroad-frontend',
  'dist/libs/backroad/src/lib/server/public'
);
