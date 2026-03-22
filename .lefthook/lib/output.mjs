export const AI_HANDOFF_DIR = '.git/ai-handoffs';
export const HELP_FILE_PATH = '.lefthook/HELP.md';

const ANSI_PATTERN = new RegExp(
  '\\u001B(?:[@-Z\\\\-_]|\\[[0-?]*[ -/]*[@-~])',
  'g'
);

export function stripAnsi(value = '') {
  return value.replace(ANSI_PATTERN, '').replace(/\r\n/g, '\n');
}

export function toPosixPath(value) {
  return value.split('\\').join('/');
}

export function formatFileList(files = []) {
  if (!files.length) {
    return ['- None'];
  }

  return files.map((file) => `- \`${toPosixPath(file)}\``);
}

export function formatConsoleBlock(value = '') {
  const stripped = stripAnsi(value).trimEnd();
  return stripped.length > 0 ? stripped : '(no output)';
}

export function printFailureMessage({
  hook,
  markdownPath,
  promptPath,
  commands,
}) {
  const hookLabel = hook === 'pre-commit' ? 'Pre-commit' : 'Pre-push';
  const action = hook === 'pre-commit' ? 'commit' : 'push';

  const lines = [
    `${hookLabel} blocked this ${action}.`,
    '',
    'Repair artifact:',
    `  ${markdownPath}`,
    '',
    'Ready-to-paste AI prompt:',
    `  ${promptPath}`,
    '',
    'Paste the AI prompt file into Codex or Claude.',
    'It tells the agent to read the repair artifact and helper files itself.',
    '',
    'Useful commands:',
    ...commands.map((command) => `  ${command}`),
    '',
    'Repo help:',
    `  ${HELP_FILE_PATH}`,
  ];

  console.error(lines.join('\n'));
}

export function printSuccessMessage({ hook, manualMode }) {
  if (!manualMode) {
    return;
  }

  const label = hook === 'pre-commit' ? 'Pre-commit' : 'Pre-push';
  console.log(`${label} checks passed.`);
}

export function printHookHelp() {
  const lines = [
    'Backroad hook help',
    '',
    'Artifacts:',
    '  .git/ai-handoffs/pre-commit-latest.md',
    '  .git/ai-handoffs/pre-commit-open-in-ai.txt',
    '  .git/ai-handoffs/pre-push-latest.md',
    '  .git/ai-handoffs/pre-push-open-in-ai.txt',
    '  .git/ai-handoffs/latest.md',
    '  .git/ai-handoffs/open-in-ai.txt',
    '',
    'Helper files:',
    '  .lefthook/HELP.md',
    '  .lefthook/pre-commit/run.mjs',
    '  .lefthook/pre-push/run.mjs',
    '  lefthook.yml',
    '',
    'Manual commands:',
    '  pnpm pre-commit-check',
    '  pnpm pre-push-check',
    '  pnpm hook-help',
  ];

  console.log(lines.join('\n'));
}
