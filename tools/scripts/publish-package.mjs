import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { readJson, run, workspaceRoot } from './helpers.mjs';

const distDirectory = process.argv[2];
const tag = process.argv[3];

if (!distDirectory || !tag) {
  throw new Error(
    'Usage: node tools/scripts/publish-package.mjs <dist-directory> <tag>'
  );
}

const { name, version } = await readJson(
  path.join(distDirectory, 'package.json')
);

// Idempotency safety net: if this exact version is already on npm, skip instead of
// failing with E403. Lets a re-run finish the remaining steps (e.g. the git tag)
// after an earlier run published but died before tagging.
function alreadyPublished() {
  try {
    const published = execFileSync(
      'npm',
      ['view', `${name}@${version}`, 'version'],
      {
        cwd: workspaceRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim();
    return published === version;
  } catch {
    // `npm view` exits non-zero when the version (or package) does not exist.
    return false;
  }
}

if (alreadyPublished()) {
  console.log(`${name}@${version} already published — skipping.`);
} else {
  run(
    'pnpm',
    ['publish', '--access', 'public', '--tag', tag, '--no-git-checks'],
    {
      cwd: path.join(workspaceRoot, distDirectory),
    }
  );
}
