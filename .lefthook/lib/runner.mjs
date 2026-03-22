import { spawn } from 'node:child_process';
import { stripAnsi } from './output.mjs';

export function runCommandStep({
  name,
  purpose,
  command,
  args = [],
  commandText,
  affectedFiles = [],
  cwd = process.cwd(),
  env = process.env,
}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...env,
        FORCE_COLOR: '0',
        NO_COLOR: '1',
      },
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
        name,
        purpose,
        command: commandText ?? [command, ...args].join(' '),
        affectedFiles,
        stdout: stripAnsi(stdout),
        stderr: stripAnsi(`${stderr}${error.stack ?? String(error)}\n`),
        exitCode: 1,
      });
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        name,
        purpose,
        command: commandText ?? [command, ...args].join(' '),
        affectedFiles,
        stdout: stripAnsi(stdout),
        stderr: stripAnsi(stderr),
        exitCode: code ?? 1,
      });
    });
  });
}

export function createRuleResult({
  name,
  purpose,
  command,
  affectedFiles = [],
  diagnostics = [],
  stdout = '',
  stderr = '',
  exitCode = 0,
}) {
  return {
    success: exitCode === 0,
    name,
    purpose,
    command,
    affectedFiles,
    diagnostics,
    stdout,
    stderr,
    exitCode,
  };
}
