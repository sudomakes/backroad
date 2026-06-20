import {
  assertFileExists,
  publishTagForVersion,
  validateVersion,
  run,
} from './helpers.mjs';

// PUBLISH phase: ships the artifacts built by release.mjs. semantic-release runs
// this after `prepare` and pushes the git tag immediately after it succeeds, so a
// successful npm publish can never be stranded without its matching tag.
const version = process.env.VERSION;
validateVersion(version);

// Last gate before npm: the @backroad/backroad package is useless without the
// prebuilt UI. Refuse to publish if it is missing, no matter what prepare did.
assertFileExists(
  'dist/libs/backroad/src/lib/server/public/index.html',
  'dist/libs/backroad is missing the frontend bundle (src/lib/server/public/index.html) — refusing to publish a broken package.'
);

const tag = publishTagForVersion(version);

run('node', [
  'tools/scripts/publish-package.mjs',
  'dist/libs/backroad-core',
  tag,
]);
run('node', ['tools/scripts/publish-package.mjs', 'dist/libs/backroad', tag]);
