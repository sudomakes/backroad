module.exports = {
  branches: ['main'],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      { type: 'feat', section: 'Features' },
      { type: 'fix', section: 'Bug Fixes' },
      { type: 'chore', section: 'Chores' },
      { type: 'docs', hidden: true },
      { type: 'style', hidden: true },
      { type: 'refactor', section: 'Refactoring' },
      { type: 'perf', hidden: true },
      { type: 'test', hidden: true },
    ],
  },
  releaseRules: [{ type: 'refactor', release: 'patch' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `./CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/exec',
      {
        // Build + assemble + publish all happen in this one command so the built
        // `dist` cannot be clobbered between semantic-release phases. See release.mjs.
        prepareCmd: `VERSION=\${nextRelease.version} pnpm run release`,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [`libs/**/package.json`, `package.json`, `CHANGELOG.md`],
        message:
          'chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
