#!/usr/bin/env node

import {
  cleanupHookArtifacts,
  writeFailureArtifacts,
} from '../lib/artifacts.mjs';
import {
  getChangedFilesBetween,
  getDefaultRemoteRef,
  getMergeBase,
  getRepoRoot,
  getUncommittedFiles,
  getUpstreamRef,
  hasUncommittedChanges,
  isZeroSha,
  parsePrePushRefs,
  readStdin,
  revParse,
} from '../lib/git.mjs';
import { printFailureMessage, printSuccessMessage } from '../lib/output.mjs';
import { createRuleResult, runCommandStep } from '../lib/runner.mjs';

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

async function resolvePrePushContext({ manualMode, cwd }) {
  const explicitSince = getArgValue('--since');

  if (explicitSince) {
    return {
      sinceRef: explicitSince,
      changedFiles: await getChangedFilesBetween(explicitSince, 'HEAD', cwd),
    };
  }

  if (!manualMode) {
    const refs = parsePrePushRefs(await readStdin());
    const activeRef = refs.find((ref) => !isZeroSha(ref.localSha));

    if (activeRef) {
      const head = activeRef.localSha;

      if (!isZeroSha(activeRef.remoteSha)) {
        return {
          sinceRef: activeRef.remoteSha,
          changedFiles: await getChangedFilesBetween(
            activeRef.remoteSha,
            head,
            cwd
          ),
        };
      }

      const upstream = await getUpstreamRef(cwd);
      if (upstream) {
        const sinceRef = await getMergeBase(upstream, head, cwd);
        return {
          sinceRef,
          changedFiles: await getChangedFilesBetween(sinceRef, head, cwd),
        };
      }

      const defaultRemote = await getDefaultRemoteRef(cwd);
      if (defaultRemote) {
        const sinceRef = await getMergeBase(defaultRemote, head, cwd);
        return {
          sinceRef,
          changedFiles: await getChangedFilesBetween(sinceRef, head, cwd),
        };
      }

      const sinceRef = await revParse('HEAD~1', cwd);
      return {
        sinceRef,
        changedFiles: await getChangedFilesBetween(sinceRef, head, cwd),
      };
    }
  }

  const head = await revParse('HEAD', cwd);
  const upstream = await getUpstreamRef(cwd);

  if (upstream) {
    const sinceRef = await getMergeBase(upstream, head, cwd);
    return {
      sinceRef,
      changedFiles: (await hasUncommittedChanges(cwd))
        ? getUncommittedFiles(cwd)
        : getChangedFilesBetween(sinceRef, head, cwd),
    };
  }

  const defaultRemote = await getDefaultRemoteRef(cwd);
  if (defaultRemote) {
    const sinceRef = await getMergeBase(defaultRemote, head, cwd);
    return {
      sinceRef,
      changedFiles: (await hasUncommittedChanges(cwd))
        ? getUncommittedFiles(cwd)
        : getChangedFilesBetween(sinceRef, head, cwd),
    };
  }

  const sinceRef = await revParse('HEAD~1', cwd);
  return {
    sinceRef,
    changedFiles: (await hasUncommittedChanges(cwd))
      ? getUncommittedFiles(cwd)
      : getChangedFilesBetween(sinceRef, head, cwd),
  };
}

async function runWorkspaceTarget({
  target,
  purpose,
  sinceRef,
  affectedFiles,
  cwd,
}) {
  return runCommandStep({
    name: `changed ${target}`,
    purpose,
    command: 'pnpm',
    args: [
      '--reporter',
      'append-only',
      '-r',
      '--filter',
      `...[${sinceRef}]`,
      '--if-present',
      'run',
      target,
    ],
    commandText: `pnpm --reporter append-only -r --filter \"...[${sinceRef}]\" --if-present run ${target}`,
    affectedFiles,
    cwd,
    env: {
      ...process.env,
      CI: '1',
    },
  });
}

async function main() {
  const manualMode = process.argv.includes('--manual');
  const cwd = await getRepoRoot(process.cwd());
  const context = await resolvePrePushContext({ manualMode, cwd });
  const affectedFiles = context.changedFiles;

  if (affectedFiles.length === 0) {
    await cleanupHookArtifacts({ hook: 'pre-push', cwd });
    printSuccessMessage({ hook: 'pre-push', manualMode });
    return;
  }

  const failures = [];

  const lint = await runWorkspaceTarget({
    target: 'lint',
    purpose: 'Run changed-package lint checks before code leaves the machine.',
    sinceRef: context.sinceRef,
    affectedFiles,
    cwd,
  });

  if (!lint.success) {
    failures.push(lint);
  }

  const tests = await runWorkspaceTarget({
    target: 'test',
    purpose: 'Run changed-package tests before code leaves the machine.',
    sinceRef: context.sinceRef,
    affectedFiles,
    cwd,
  });

  if (!tests.success) {
    failures.push(tests);
  }

  const build = await runWorkspaceTarget({
    target: 'build',
    purpose: 'Run changed-package builds before code leaves the machine.',
    sinceRef: context.sinceRef,
    affectedFiles,
    cwd,
  });

  if (!build.success) {
    failures.push(build);
  }

  if (failures.length > 0) {
    const paths = await writeFailureArtifacts({
      hook: 'pre-push',
      failures,
      cwd,
    });

    printFailureMessage({
      hook: 'pre-push',
      markdownPath: paths.markdownPath,
      promptPath: paths.promptPath,
      commands: ['pnpm pre-push-check'],
    });

    process.exit(1);
  }

  await cleanupHookArtifacts({ hook: 'pre-push', cwd });
  printSuccessMessage({ hook: 'pre-push', manualMode });
}

main().catch(async (error) => {
  const cwd = await getRepoRoot(process.cwd()).catch(() => process.cwd());
  const failure = createRuleResult({
    name: 'pre-push-runner',
    purpose: 'Run the Backroad pre-push guardrail workflow.',
    command: 'pnpm exec node .lefthook/pre-push/run.mjs',
    affectedFiles: [],
    stdout: '',
    stderr: `${error.stack ?? String(error)}\n`,
    exitCode: 1,
  });

  const paths = await writeFailureArtifacts({
    hook: 'pre-push',
    failures: [failure],
    cwd,
  });

  printFailureMessage({
    hook: 'pre-push',
    markdownPath: paths.markdownPath,
    promptPath: paths.promptPath,
    commands: ['pnpm pre-push-check'],
  });
  process.exit(1);
});
