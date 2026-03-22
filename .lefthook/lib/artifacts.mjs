import fs from 'node:fs/promises';
import path from 'node:path';
import {
  AI_HANDOFF_DIR,
  formatConsoleBlock,
  formatFileList,
  HELP_FILE_PATH,
} from './output.mjs';

const ALIAS_MARKER = '<!-- ai-handoff-alias';

function getHookMetadata(hook) {
  if (hook === 'pre-commit') {
    return {
      label: 'pre-commit',
      blockedAction: 'commit',
      markdownPath: `${AI_HANDOFF_DIR}/pre-commit-latest.md`,
      promptPath: `${AI_HANDOFF_DIR}/pre-commit-open-in-ai.txt`,
      helperFiles: [
        `${AI_HANDOFF_DIR}/pre-commit-latest.md`,
        HELP_FILE_PATH,
        '.lefthook/pre-commit/run.mjs',
        'lefthook.yml',
      ],
      commands: ['pnpm pre-commit-check'],
    };
  }

  return {
    label: 'pre-push',
    blockedAction: 'push',
    markdownPath: `${AI_HANDOFF_DIR}/pre-push-latest.md`,
    promptPath: `${AI_HANDOFF_DIR}/pre-push-open-in-ai.txt`,
    helperFiles: [
      `${AI_HANDOFF_DIR}/pre-push-latest.md`,
      HELP_FILE_PATH,
      '.lefthook/pre-push/run.mjs',
      'lefthook.yml',
    ],
    commands: ['pnpm pre-push-check'],
  };
}

function buildFailureSummary(failures) {
  return failures
    .map((failure) => {
      const lines = [
        `### ${failure.name}`,
        `- Exit code: \`${failure.exitCode}\``,
        '- Affected files:',
      ];

      return [...lines, ...formatFileList(failure.affectedFiles)].join('\n');
    })
    .join('\n\n');
}

function buildDiagnosticsSection(failure) {
  if (!failure.diagnostics?.length) {
    return '';
  }

  const items = failure.diagnostics
    .map((diagnostic) =>
      [
        `- File: \`${diagnostic.file}\``,
        `- Line: \`${diagnostic.line}\``,
        diagnostic.message ? `- Why this failed: ${diagnostic.message}` : null,
        diagnostic.snippet ? `- Snippet: \`${diagnostic.snippet}\`` : null,
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n');

  return `### Rule diagnostics\n${items}\n`;
}

function buildStepDetailSections(failures) {
  return failures
    .map((failure) => {
      const diagnosticsSection = buildDiagnosticsSection(failure).trimEnd();

      return [
        `## ${failure.name}`,
        '- Command or rule:',
        '```text',
        failure.command,
        '```',
        `- Purpose: ${failure.purpose}`,
        '- Affected files:',
        ...formatFileList(failure.affectedFiles),
        `- Exit code: \`${failure.exitCode}\``,
        diagnosticsSection ? '' : null,
        diagnosticsSection || null,
        diagnosticsSection ? '' : null,
        '### Stdout',
        '```text',
        formatConsoleBlock(failure.stdout),
        '```',
        '',
        '### Stderr',
        '```text',
        formatConsoleBlock(failure.stderr),
        '```',
      ]
        .filter((value) => value !== null)
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    })
    .join('\n\n');
}

function buildMarkdownArtifact({ hook, failures }) {
  const metadata = getHookMetadata(hook);
  const promptFileName = path.basename(metadata.promptPath);

  return [
    `# Git blocked this ${metadata.blockedAction}`,
    '',
    `Git stopped this ${metadata.blockedAction} because one or more ${metadata.label} checks failed.`,
    '',
    '## How to use this artifact',
    '',
    '- This Markdown file is the source of truth for what failed and why.',
    `- Preferred workflow: paste \`${promptFileName}\` into Codex or Claude so the agent can read this artifact and helper files itself.`,
    '- Fallback workflow: if the AI cannot read repo files, paste this full Markdown artifact directly.',
    '',
    '## Primary AI workflow',
    '',
    `1. Open \`${metadata.promptPath}\`.`,
    '2. Paste that file into Codex or Claude.',
    '3. Ask the agent to fix only the issues listed here, then rerun the recommended commands.',
    '',
    '## Useful repo helper files',
    '',
    ...metadata.helperFiles.map((file) => `- \`${file}\``),
    '',
    '## What to do next',
    '',
    ...metadata.commands.map((command) => `- \`${command}\``),
    '',
    '## Failure summary',
    '',
    buildFailureSummary(failures),
    '',
    '## Per-step detail sections',
    '',
    buildStepDetailSections(failures),
    '',
  ].join('\n');
}

function buildPromptArtifact({ hook }) {
  const metadata = getHookMetadata(hook);
  const artifactPath = metadata.markdownPath;
  const runnerPath =
    hook === 'pre-commit'
      ? '.lefthook/pre-commit/run.mjs'
      : '.lefthook/pre-push/run.mjs';
  const rerunCommand =
    hook === 'pre-commit' ? 'pnpm pre-commit-check' : 'pnpm pre-push-check';

  return [
    `This is a Backroad ${metadata.label} failure.`,
    '',
    'Read these repo files before making changes:',
    `- ${artifactPath}`,
    `- ${HELP_FILE_PATH}`,
    `- ${runnerPath}`,
    '- lefthook.yml',
    '',
    'Instructions:',
    '- Use the repair artifact as the source of truth.',
    '- Fix only the listed issues.',
    '- Prefer repo scripts and narrow changes.',
    '- Avoid unrelated refactors.',
    `- Rerun \`${rerunCommand}\` after fixing the issues.`,
  ].join('\n');
}

function buildMarkdownAlias({ hook, canonicalPath, content }) {
  return [
    `${ALIAS_MARKER} hook:${hook} canonical:${canonicalPath} -->`,
    'This generic alias mirrors the latest hook failure.',
    '',
    `Generated by hook: \`${hook}\``,
    `Canonical artifact: \`${canonicalPath}\``,
    '',
    '---',
    '',
    content,
  ].join('\n');
}

function buildPromptAlias({ hook, canonicalPath, content }) {
  return [
    `${ALIAS_MARKER} hook:${hook} canonical:${canonicalPath} -->`,
    'This generic alias mirrors the latest hook failure.',
    `Generated by hook: ${hook}`,
    `Canonical prompt file: ${canonicalPath}`,
    '',
    'Paste the prompt below into Codex or Claude.',
    '',
    content,
  ].join('\n');
}

async function ensureArtifactDir(cwd) {
  await fs.mkdir(path.join(cwd, AI_HANDOFF_DIR), { recursive: true });
}

export function getArtifactPaths(hook) {
  const metadata = getHookMetadata(hook);
  return {
    markdownPath: metadata.markdownPath,
    promptPath: metadata.promptPath,
    aliasMarkdownPath: `${AI_HANDOFF_DIR}/latest.md`,
    aliasPromptPath: `${AI_HANDOFF_DIR}/open-in-ai.txt`,
  };
}

export async function writeFailureArtifacts({ hook, failures, cwd }) {
  const { markdownPath, promptPath, aliasMarkdownPath, aliasPromptPath } =
    getArtifactPaths(hook);
  const absoluteMarkdownPath = path.join(cwd, markdownPath);
  const absolutePromptPath = path.join(cwd, promptPath);
  const absoluteAliasMarkdownPath = path.join(cwd, aliasMarkdownPath);
  const absoluteAliasPromptPath = path.join(cwd, aliasPromptPath);
  const markdown = buildMarkdownArtifact({ hook, failures });
  const prompt = buildPromptArtifact({ hook });

  await ensureArtifactDir(cwd);
  await fs.writeFile(absoluteMarkdownPath, markdown, 'utf8');
  await fs.writeFile(absolutePromptPath, prompt, 'utf8');
  await fs.writeFile(
    absoluteAliasMarkdownPath,
    buildMarkdownAlias({
      hook,
      canonicalPath: markdownPath,
      content: markdown,
    }),
    'utf8'
  );
  await fs.writeFile(
    absoluteAliasPromptPath,
    buildPromptAlias({ hook, canonicalPath: promptPath, content: prompt }),
    'utf8'
  );

  return { markdownPath, promptPath };
}

async function removeIfExists(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function removeAliasIfOwnedByHook({ filePath, hook }) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.startsWith(`${ALIAS_MARKER} hook:${hook} `)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

export async function cleanupHookArtifacts({ hook, cwd }) {
  const { markdownPath, promptPath, aliasMarkdownPath, aliasPromptPath } =
    getArtifactPaths(hook);

  await removeIfExists(path.join(cwd, markdownPath));
  await removeIfExists(path.join(cwd, promptPath));
  await removeAliasIfOwnedByHook({
    filePath: path.join(cwd, aliasMarkdownPath),
    hook,
  });
  await removeAliasIfOwnedByHook({
    filePath: path.join(cwd, aliasPromptPath),
    hook,
  });
}
