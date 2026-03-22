import path from 'node:path';

import { run, workspaceRoot } from './helpers.mjs';

const distDirectory = process.argv[2];
const tag = process.argv[3];

if (!distDirectory || !tag) {
  throw new Error(
    'Usage: node tools/scripts/publish-package.mjs <dist-directory> <tag>'
  );
}

run(
  'pnpm',
  ['publish', '--access', 'public', '--tag', tag, '--no-git-checks'],
  {
    cwd: path.join(workspaceRoot, distDirectory),
  }
);
