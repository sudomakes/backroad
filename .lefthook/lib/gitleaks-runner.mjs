#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────
// gitleaks-runner: download + verify + invoke the official gitleaks
// binary from github.com/gitleaks/gitleaks releases.
//
// Why not `pnpm dlx gitleaks` or a homebrew install?
//   * The `gitleaks` npm package is an unmaintained 2020 stub — `pnpm
//     dlx gitleaks` fails with NO_BIN. Verified manually.
//   * Homebrew makes the hook fail for any teammate who hasn't run
//     `brew install gitleaks` (and pins them to whatever floating
//     version brew has today).
//   * Third-party npm wrappers like `@nogoo9/gitleaks` exist but pull
//     a per-platform binary from a low-trust npm scope. For a
//     security-tooling devDep we want minimal supply-chain surface.
//
// So: pin a version + SHA256 here, fetch from the official GitHub
// release on first use, verify the checksum, cache under
// `node_modules/.cache/gitleaks/<version>/`, then exec.
// ──────────────────────────────────────────────────────────────────────

import { execFile, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// Pinned: gitleaks v8.30.1, published 2026-03-21 (well past the 24h
// cooldown gate). Bump together with checksums when upgrading.
export const GITLEAKS_VERSION = '8.30.1';

// SHA256 hashes for `gitleaks_<v>_<platform>.tar.gz`, copied verbatim
// from the official `gitleaks_8.30.1_checksums.txt` published with the
// release. If you bump the version, refresh these from
// https://github.com/gitleaks/gitleaks/releases/download/v<v>/gitleaks_<v>_checksums.txt
const CHECKSUMS = {
  darwin_arm64:
    'b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5',
  darwin_x64:
    'dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709',
  linux_arm64:
    'e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080',
  linux_x64: '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
  linux_armv7:
    '8d39f0d94ba0d774b2282187656fb039a2d82893ec1fd6be7d7121aae759a57d',
};

const PLATFORM_MAP = {
  'darwin-arm64': 'darwin_arm64',
  'darwin-x64': 'darwin_x64',
  'linux-arm64': 'linux_arm64',
  'linux-x64': 'linux_x64',
  'linux-arm': 'linux_armv7',
};

function getPlatformKey() {
  return `${os.platform()}-${os.arch()}`;
}

function getReleaseAsset() {
  const key = getPlatformKey();
  const slug = PLATFORM_MAP[key];
  if (!slug) {
    return null;
  }
  return {
    slug,
    filename: `gitleaks_${GITLEAKS_VERSION}_${slug}.tar.gz`,
    url: `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${slug}.tar.gz`,
    expectedSha256: CHECKSUMS[slug] ?? null,
  };
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function sha256OfFile(target) {
  const hash = createHash('sha256');
  const buffer = await fs.readFile(target);
  hash.update(buffer);
  return hash.digest('hex');
}

async function downloadTo(url, destFile) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) {
    throw new Error(
      `[gitleaks] download failed: HTTP ${response.status} for ${url}`
    );
  }
  await fs.mkdir(path.dirname(destFile), { recursive: true });
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destFile));
}

async function extractGitleaksBinary(tarPath, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  // Use system `tar` rather than pulling another dep. It's available
  // on every supported platform (BSD tar on macOS, GNU tar on Linux).
  await execFileAsync('tar', ['-xzf', tarPath, '-C', destDir, 'gitleaks'], {
    maxBuffer: 1024 * 1024 * 20,
  });
  const binary = path.join(destDir, 'gitleaks');
  await fs.chmod(binary, 0o755);
  return binary;
}

export async function ensureGitleaks(cwd) {
  const asset = getReleaseAsset();
  if (!asset) {
    throw new Error(
      `[gitleaks] unsupported platform ${getPlatformKey()}. ` +
        `Add a mapping in .lefthook/lib/gitleaks-runner.mjs or install ` +
        `gitleaks manually.`
    );
  }

  const cacheRoot = path.join(
    cwd,
    'node_modules',
    '.cache',
    'gitleaks',
    GITLEAKS_VERSION
  );
  const binary = path.join(cacheRoot, 'gitleaks');
  const tarPath = path.join(cacheRoot, asset.filename);

  if (await pathExists(binary)) {
    return binary;
  }

  await fs.mkdir(cacheRoot, { recursive: true });
  await downloadTo(asset.url, tarPath);

  if (asset.expectedSha256) {
    const actual = await sha256OfFile(tarPath);
    if (actual !== asset.expectedSha256) {
      // Remove the bad tarball so we don't hand a corrupt binary to
      // future runs.
      await fs.rm(tarPath, { force: true });
      throw new Error(
        `[gitleaks] checksum mismatch for ${asset.filename}\n` +
          `  expected: ${asset.expectedSha256}\n` +
          `  actual:   ${actual}\n` +
          `Refusing to install. Verify the pinned checksum in ` +
          `.lefthook/lib/gitleaks-runner.mjs matches the official ` +
          `gitleaks_${GITLEAKS_VERSION}_checksums.txt.`
      );
    }
  } else {
    // Defense-in-depth: if a slug ever lands without a pinned checksum
    // refuse to run, rather than silently trusting whatever we just
    // downloaded.
    await fs.rm(tarPath, { force: true });
    throw new Error(
      `[gitleaks] no checksum pinned for slug ${asset.slug}. ` +
        `Add one in .lefthook/lib/gitleaks-runner.mjs before running.`
    );
  }

  await extractGitleaksBinary(tarPath, cacheRoot);
  // Tarball no longer needed; the verified binary is on disk.
  await fs.rm(tarPath, { force: true });

  return binary;
}

export function runGitleaks(binary, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(binary, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      resolve({
        success: false,
        stdout,
        stderr: `${stderr}${error.stack ?? String(error)}\n`,
        exitCode: 1,
      });
    });
    child.on('close', (code) => {
      resolve({
        success: code === 0,
        stdout,
        stderr,
        exitCode: code ?? 1,
      });
    });
  });
}
