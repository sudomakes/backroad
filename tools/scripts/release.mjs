import path from 'node:path';
import { rm } from 'node:fs/promises';

import {
  assertFileExists,
  copyDirectoryContents,
  publishTagForVersion,
  readJson,
  run,
  validateVersion,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

// Single-phase release: stamp versions → build → assemble → verify → publish, all
// in one process. An earlier attempt split publish into a separate semantic-release
// `publish` step; the working `dist` got clobbered between phases and shipped a
// package with no UI (1.18.0). Keeping everything sequential here avoids any
// cross-phase gap. npm/git desync is handled by publish-package.mjs's idempotent
// skip (a re-run finishes the git tag without re-publishing).
const FRONTEND_DIST = 'dist/libs/backroad-frontend';
const BACKROAD_PUBLIC = 'dist/libs/backroad/src/lib/server/public';

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

// The frontend bundle is what the server serves at runtime. Fail loudly if the
// build did not produce it — copyDirectoryContents would otherwise silently no-op
// on a missing source and ship a package that 404s out of the box.
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

const tag = publishTagForVersion(version);

run('node', [
  'tools/scripts/publish-package.mjs',
  'dist/libs/backroad-core',
  tag,
]);
run('node', ['tools/scripts/publish-package.mjs', 'dist/libs/backroad', tag]);
