import path from 'node:path';

import {
  copyDirectoryContents,
  copyIfPresent,
  createTempDir,
  ensureCleanDir,
  getWorkspacePackages,
  pathExists,
  readJson,
  rewriteWorkspaceDependencies,
  run,
  workspaceRoot,
  writeJson,
} from './helpers.mjs';

const target = process.argv[2];

const libraries = {
  backroad: {
    distDir: 'dist/libs/backroad',
    packageFile: 'libs/backroad/package.json',
    packageSourceDir: 'libs/backroad',
    readmeFile: 'libs/backroad/README.md',
    tsconfig: 'libs/backroad/tsconfig.lib.json',
    extraCopies: [
      {
        source: 'libs/backroad/src/lib/server/public',
        destination: 'dist/libs/backroad/src/lib/server/public',
      },
    ],
  },
  'backroad-core': {
    distDir: 'dist/libs/backroad-core',
    packageFile: 'libs/backroad-core/package.json',
    packageSourceDir: 'libs/backroad-core',
    readmeFile: 'libs/backroad-core/README.md',
    tsconfig: 'libs/backroad-core/tsconfig.lib.json',
    extraCopies: [],
  },
};

const config = libraries[target];

if (!config) {
  throw new Error(`Unknown library target "${target}"`);
}

const workspacePackages = await getWorkspacePackages();
const packageJson = await readJson(config.packageFile);
const tempDir = await createTempDir(`${target}-build`);

run('pnpm', [
  'exec',
  'tsc',
  '-p',
  path.join(workspaceRoot, config.tsconfig),
  '--outDir',
  tempDir,
]);

await ensureCleanDir(config.distDir);

const compiledSourceDir = path.join(tempDir, config.packageSourceDir, 'src');
const distSourceDir = path.join(config.distDir, 'src');
await copyIfPresent(
  path.relative(workspaceRoot, compiledSourceDir),
  distSourceDir
);

for (const asset of config.extraCopies) {
  if (await pathExists(asset.source)) {
    await copyDirectoryContents(asset.source, asset.destination);
  }
}

if (await pathExists(config.readmeFile)) {
  await copyIfPresent(
    config.readmeFile,
    path.join(config.distDir, 'README.md')
  );
}

const publishPackageJson = {
  ...packageJson,
  dependencies: rewriteWorkspaceDependencies(
    packageJson.dependencies,
    workspacePackages
  ),
  optionalDependencies: rewriteWorkspaceDependencies(
    packageJson.optionalDependencies,
    workspacePackages
  ),
  peerDependencies: rewriteWorkspaceDependencies(
    packageJson.peerDependencies,
    workspacePackages
  ),
};

delete publishPackageJson.devDependencies;
delete publishPackageJson.private;
delete publishPackageJson.scripts;

await writeJson(path.join(config.distDir, 'package.json'), publishPackageJson);
