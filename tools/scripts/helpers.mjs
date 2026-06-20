import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

export const workspaceRoot = path.resolve(scriptsDir, '../..');

const workspacePackageFiles = [
  'libs/backroad-frontend/package.json',
  'libs/backroad-components/package.json',
  'libs/backroad/package.json',
  'libs/backroad-core/package.json',
  'examples/demo/package.json',
];

export function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    ...options,
  });
}

export async function readJson(relativePath) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  return JSON.parse(await readFile(absolutePath, 'utf8'));
}

export async function writeJson(relativePath, value) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function ensureCleanDir(relativePath) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  await rm(absolutePath, { force: true, recursive: true });
  await mkdir(absolutePath, { recursive: true });
  return absolutePath;
}

export async function createTempDir(prefix) {
  return mkdtemp(path.join(tmpdir(), `${prefix}-`));
}

export async function copyIfPresent(
  sourceRelativePath,
  destinationRelativePath
) {
  const sourcePath = path.join(workspaceRoot, sourceRelativePath);
  if (!existsSync(sourcePath)) {
    return;
  }

  await mkdir(path.dirname(path.join(workspaceRoot, destinationRelativePath)), {
    recursive: true,
  });
  await cp(sourcePath, path.join(workspaceRoot, destinationRelativePath), {
    recursive: true,
  });
}

export async function copyDirectoryContents(
  sourceRelativePath,
  destinationRelativePath
) {
  const sourcePath = path.join(workspaceRoot, sourceRelativePath);
  if (!existsSync(sourcePath)) {
    return;
  }

  const destinationPath = path.join(workspaceRoot, destinationRelativePath);
  await mkdir(destinationPath, { recursive: true });

  for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
    await cp(
      path.join(sourcePath, entry.name),
      path.join(destinationPath, entry.name),
      {
        recursive: true,
      }
    );
  }
}

export async function pathExists(relativePath) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  try {
    await stat(absolutePath);
    return true;
  } catch {
    return false;
  }
}

export async function getWorkspacePackages() {
  const packages = new Map();
  for (const packageFile of workspacePackageFiles) {
    const packageJson = await readJson(packageFile);
    packages.set(packageJson.name, {
      dir: path.dirname(packageFile),
      file: packageFile,
      packageJson,
    });
  }
  return packages;
}

export function rewriteWorkspaceDependencies(section, workspacePackages) {
  if (!section) {
    return section;
  }

  return Object.fromEntries(
    Object.entries(section).map(([name, version]) => {
      if (!version.startsWith('workspace:')) {
        return [name, version];
      }

      const target = workspacePackages.get(name);
      if (!target) {
        throw new Error(`Could not resolve workspace dependency "${name}"`);
      }

      return [name, target.packageJson.version];
    })
  );
}

export function assertFileExists(relativePath, message) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(
      message ?? `Expected file to exist but it was missing: ${relativePath}`
    );
  }
}

export function publishTagForVersion(version) {
  return version.includes('-') ? 'alpha' : 'latest';
}

export function validateVersion(version) {
  const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?$/;
  if (!version || !validVersion.test(version)) {
    throw new Error(
      `Expected VERSION to match #.#.#-tag.# or #.#.#, received "${
        version ?? ''
      }".`
    );
  }
}
