import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { stripAnsi, toPosixPath } from './output.mjs';

const execFileAsync = promisify(execFile);

async function execGit(args, options = {}) {
  const result = await execFileAsync('git', args, {
    cwd: options.cwd ?? process.cwd(),
    maxBuffer: 1024 * 1024 * 20,
  });

  return {
    stdout: stripAnsi(result.stdout ?? ''),
    stderr: stripAnsi(result.stderr ?? ''),
  };
}

export async function getRepoRoot(cwd = process.cwd()) {
  const { stdout } = await execGit(['rev-parse', '--show-toplevel'], { cwd });
  return stdout.trim();
}

export async function getGitDir(cwd = process.cwd()) {
  const { stdout } = await execGit(['rev-parse', '--git-dir'], { cwd });
  const gitDir = stdout.trim();
  return path.isAbsolute(gitDir) ? gitDir : path.join(cwd, gitDir);
}

export async function getStagedFiles(cwd = process.cwd()) {
  const { stdout } = await execGit(
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
    { cwd }
  );

  return stdout
    .split('\0')
    .map((file) => file.trim())
    .filter(Boolean)
    .map(toPosixPath);
}

export async function restageFiles(files, cwd = process.cwd()) {
  if (!files.length) {
    return;
  }

  await execFileAsync('git', ['add', '--', ...files], {
    cwd,
    maxBuffer: 1024 * 1024 * 20,
  });
}

export async function getChangedFilesBetween(base, head, cwd = process.cwd()) {
  const { stdout } = await execGit(
    ['diff', '--name-only', '--diff-filter=ACMR', base, head],
    { cwd }
  );

  return stdout
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .map(toPosixPath);
}

export async function getUncommittedFiles(cwd = process.cwd()) {
  const [tracked, untracked] = await Promise.all([
    execGit(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'], { cwd }),
    execGit(['ls-files', '--others', '--exclude-standard'], { cwd }),
  ]);

  return `${tracked.stdout}\n${untracked.stdout}`
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .map(toPosixPath)
    .filter((file, index, files) => files.indexOf(file) === index);
}

export async function hasUncommittedChanges(cwd = process.cwd()) {
  const { stdout } = await execGit(['status', '--porcelain'], { cwd });
  return stdout.trim().length > 0;
}

export async function getMergeBase(
  baseRef,
  headRef = 'HEAD',
  cwd = process.cwd()
) {
  const { stdout } = await execGit(['merge-base', baseRef, headRef], { cwd });
  return stdout.trim();
}

export async function getUpstreamRef(cwd = process.cwd()) {
  try {
    const { stdout } = await execGit(
      ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'],
      { cwd }
    );
    const upstream = stdout.trim();
    return upstream.length > 0 ? upstream : null;
  } catch {
    return null;
  }
}

export async function getDefaultRemoteRef(cwd = process.cwd()) {
  try {
    const { stdout } = await execGit(
      ['symbolic-ref', 'refs/remotes/origin/HEAD'],
      { cwd }
    );
    const remoteHead = stdout.trim();
    return remoteHead.replace(/^refs\/remotes\//, '');
  } catch {
    return null;
  }
}

export async function revParse(ref, cwd = process.cwd()) {
  const { stdout } = await execGit(['rev-parse', ref], { cwd });
  return stdout.trim();
}

export function readStdin() {
  if (process.stdin.isTTY) {
    return '';
  }

  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

export function parsePrePushRefs(stdin) {
  return stdin
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [localRef, localSha, remoteRef, remoteSha] = line.split(/\s+/);
      return {
        localRef,
        localSha,
        remoteRef,
        remoteSha,
      };
    });
}

export function isZeroSha(value = '') {
  return /^0+$/.test(value);
}
