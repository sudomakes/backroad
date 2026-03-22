#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  cleanupHookArtifacts,
  writeFailureArtifacts,
} from '../lib/artifacts.mjs';
import { getRepoRoot, getStagedFiles, restageFiles } from '../lib/git.mjs';
import {
  printFailureMessage,
  printSuccessMessage,
  toPosixPath,
} from '../lib/output.mjs';
import { createRuleResult, runCommandStep } from '../lib/runner.mjs';

const ESLINT_FILE_PATTERN = /\.(cjs|cts|js|jsx|mjs|mts|ts|tsx)$/i;
const TS_FILE_PATTERN = /\.(ts|tsx)$/i;

async function findForbiddenTsNoCheck(files, cwd) {
  const diagnostics = [];

  for (const file of files.filter((value) => TS_FILE_PATTERN.test(value))) {
    const absolutePath = path.join(cwd, file);
    let content = '';

    try {
      content = await fs.readFile(absolutePath, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (!/^\s*\/\/\s*@ts-nocheck\b/.test(line)) {
        return;
      }

      diagnostics.push({
        file: toPosixPath(file),
        line: index + 1,
        snippet: line.trim(),
        message:
          'Remove the file-level `@ts-nocheck` and fix the underlying issue instead.',
      });
    });
  }

  return diagnostics;
}

async function findMergeConflictMarkers(files, cwd) {
  const diagnostics = [];
  const patterns = [/^<<<<<<< /, /^=======$/, /^>>>>>>> /];

  for (const file of files) {
    const absolutePath = path.join(cwd, file);
    let content = '';

    try {
      content = await fs.readFile(absolutePath, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (!patterns.some((pattern) => pattern.test(line))) {
        return;
      }

      diagnostics.push({
        file: toPosixPath(file),
        line: index + 1,
        snippet: line.trim(),
        message:
          'Resolve the merge conflict marker before committing this file.',
      });
    });
  }

  return diagnostics;
}

async function main() {
  const manualMode = process.argv.includes('--manual');
  const cwd = await getRepoRoot(process.cwd());
  const stagedFiles = await getStagedFiles(cwd);

  if (stagedFiles.length === 0) {
    await cleanupHookArtifacts({ hook: 'pre-commit', cwd });
    printSuccessMessage({ hook: 'pre-commit', manualMode });
    return;
  }

  const failures = [];

  const forbiddenDiagnostics = await findForbiddenTsNoCheck(stagedFiles, cwd);
  const forbiddenResult = createRuleResult({
    name: 'forbidden-ts-nocheck',
    purpose:
      'Prevent file-level `@ts-nocheck` directives from slipping into commits.',
    command: 'rule: forbid file-level `@ts-nocheck` in staged TypeScript files',
    affectedFiles: [
      ...new Set(forbiddenDiagnostics.map((diagnostic) => diagnostic.file)),
    ],
    diagnostics: forbiddenDiagnostics,
    stdout:
      forbiddenDiagnostics.length > 0
        ? `Found ${forbiddenDiagnostics.length} file-level @ts-nocheck occurrence(s).`
        : '',
    stderr:
      forbiddenDiagnostics.length > 0
        ? 'Remove the file-level directive and fix the underlying TypeScript issue.\n'
        : '',
    exitCode: forbiddenDiagnostics.length > 0 ? 1 : 0,
  });

  if (!forbiddenResult.success) {
    failures.push(forbiddenResult);
  }

  const conflictDiagnostics = await findMergeConflictMarkers(stagedFiles, cwd);
  const conflictResult = createRuleResult({
    name: 'merge-conflict-markers',
    purpose: 'Stop unresolved merge conflict markers from being committed.',
    command: 'rule: forbid merge conflict markers in staged files',
    affectedFiles: [
      ...new Set(conflictDiagnostics.map((diagnostic) => diagnostic.file)),
    ],
    diagnostics: conflictDiagnostics,
    stdout:
      conflictDiagnostics.length > 0
        ? `Found ${conflictDiagnostics.length} merge conflict marker occurrence(s).`
        : '',
    stderr:
      conflictDiagnostics.length > 0
        ? 'Resolve the merge conflict markers before committing.\n'
        : '',
    exitCode: conflictDiagnostics.length > 0 ? 1 : 0,
  });

  if (!conflictResult.success) {
    failures.push(conflictResult);
  }

  const eslintFiles = stagedFiles.filter((value) =>
    ESLINT_FILE_PATTERN.test(value)
  );

  if (eslintFiles.length > 0) {
    const eslintWrite = await runCommandStep({
      name: 'staged eslint --fix',
      purpose:
        'Auto-fix staged JS and TS files with ESLint before blocking the commit.',
      command: 'pnpm',
      args: [
        'exec',
        'eslint',
        '--fix',
        '--no-error-on-unmatched-pattern',
        '--',
        ...eslintFiles,
      ],
      commandText:
        'pnpm exec eslint --fix --no-error-on-unmatched-pattern -- <staged_js_ts_files>',
      affectedFiles: eslintFiles,
      cwd,
    });

    await restageFiles(eslintFiles, cwd);

    if (!eslintWrite.success) {
      failures.push(eslintWrite);
    }
  }

  const prettierWrite = await runCommandStep({
    name: 'staged prettier --write',
    purpose: 'Format staged files with Prettier before blocking the commit.',
    command: 'pnpm',
    args: [
      'exec',
      'prettier',
      '--write',
      '--ignore-unknown',
      '--',
      ...stagedFiles,
    ],
    commandText:
      'pnpm exec prettier --write --ignore-unknown -- <staged_files>',
    affectedFiles: stagedFiles,
    cwd,
  });

  await restageFiles(stagedFiles, cwd);

  if (!prettierWrite.success) {
    failures.push(prettierWrite);
  }

  if (failures.length > 0) {
    const paths = await writeFailureArtifacts({
      hook: 'pre-commit',
      failures,
      cwd,
    });

    printFailureMessage({
      hook: 'pre-commit',
      markdownPath: paths.markdownPath,
      promptPath: paths.promptPath,
      commands: ['pnpm pre-commit-check'],
    });

    process.exit(1);
  }

  await cleanupHookArtifacts({ hook: 'pre-commit', cwd });
  printSuccessMessage({ hook: 'pre-commit', manualMode });
}

main().catch(async (error) => {
  const cwd = await getRepoRoot(process.cwd()).catch(() => process.cwd());
  const failure = createRuleResult({
    name: 'pre-commit-runner',
    purpose: 'Run the Backroad pre-commit guardrail workflow.',
    command: 'pnpm exec node .lefthook/pre-commit/run.mjs',
    affectedFiles: [],
    stdout: '',
    stderr: `${error.stack ?? String(error)}\n`,
    exitCode: 1,
  });

  const paths = await writeFailureArtifacts({
    hook: 'pre-commit',
    failures: [failure],
    cwd,
  });

  printFailureMessage({
    hook: 'pre-commit',
    markdownPath: paths.markdownPath,
    promptPath: paths.promptPath,
    commands: ['pnpm pre-commit-check'],
  });
  process.exit(1);
});
