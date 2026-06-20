import path from 'node:path';
import { rm } from 'node:fs/promises';

import {
  assertFileExists,
  copyDirectoryContents,
  readJson,
  run,
  validateVersion,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

const FRONTEND_DIST = 'dist/libs/backroad-frontend';
const BACKROAD_PUBLIC = 'dist/libs/backroad/src/lib/server/public';

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

// The frontend bundle is what the server serves at runtime. If the build did not
// produce it, fail loudly here — copyDirectoryContents would otherwise silently
// no-op on a missing source and ship a package that 404s out of the box (see 1.18.0).
assertFileExists(
  `${FRONTEND_DIST}/index.html`,
  `Frontend build is missing ${FRONTEND_DIST}/index.html — refusing to assemble a package without the UI.`
);

await rm(path.join(workspaceRoot, BACKROAD_PUBLIC), {
  force: true,
  recursive: true,
});
await copyDirectoryContents(FRONTEND_DIST, BACKROAD_PUBLIC);

// Verify the bundle actually landed in the package we are about to publish.
assertFileExists(
  `${BACKROAD_PUBLIC}/index.html`,
  `Frontend bundle was not copied into ${BACKROAD_PUBLIC} — aborting before publish.`
);
