import { publishTagForVersion, validateVersion, run } from './helpers.mjs';

// PUBLISH phase: ships the artifacts built by release.mjs. semantic-release runs
// this after `prepare` and pushes the git tag immediately after it succeeds, so a
// successful npm publish can never be stranded without its matching tag.
const version = process.env.VERSION;
validateVersion(version);

const tag = publishTagForVersion(version);

run('node', [
  'tools/scripts/publish-package.mjs',
  'dist/libs/backroad-core',
  tag,
]);
run('node', ['tools/scripts/publish-package.mjs', 'dist/libs/backroad', tag]);
