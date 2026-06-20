#!/usr/bin/env node
// Duplication gate. Runs jscpd, compares the total duplication percentage
// against the `threshold` in .jscpd.json, and (in CI) emits a sticky PR-comment
// body + step summary. A ratchet: lower the threshold as duplication drops via
// `pnpm run dup-check:update`. Mirrors the knip baseline gate's shape.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SENTINEL = '<!-- duplication-report -->';

function resolveJscpdBin() {
  if (process.env.JSCPD_BIN) return process.env.JSCPD_BIN;
  const dir = path.join(process.cwd(), 'node_modules', 'jscpd');
  const pkg = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
  );
  const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.jscpd;
  return path.join(dir, rel);
}

function runJscpd() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jscpd-gate-'));
  const result = spawnSync(
    process.execPath,
    [
      resolveJscpdBin(),
      '.',
      '--silent',
      '--reporters',
      'json',
      '--output',
      outDir,
      '--no-tips',
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      env: { ...process.env, NO_COLOR: '1' },
      stdio: ['ignore', 'inherit', 'inherit'],
    }
  );
  const code = result.status ?? 0;
  const reportPath = path.join(outDir, 'jscpd-report.json');
  let report;
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch {
    report = null;
  }
  return { code, report };
}

function buildMarkdown(report, threshold) {
  if (!report || !report.statistics) {
    return `${SENTINEL}\n### 🧬 Duplication report (jscpd)\n\n⚠️ Could not parse jscpd output.\n`;
  }

  const { total, formats } = report.statistics;
  const pct = total?.percentage ?? 0;
  const ok = pct <= threshold;
  const lines = [
    SENTINEL,
    '### 🧬 Duplication report (jscpd)',
    '',
    ok
      ? `✅ **Within budget** — ${pct.toFixed(
          2
        )}% duplicated (threshold: ${threshold}%).`
      : `❌ **Duplication above budget** — ${pct.toFixed(
          2
        )}% duplicated (threshold: ${threshold}%).`,
    '',
    `| Metric | Value |`,
    `| --- | ---:|`,
    `| Total lines | ${total?.lines ?? '?'} |`,
    `| Duplicated lines | ${total?.duplicatedLines ?? 0} |`,
    `| Duplication | ${pct.toFixed(2)}% |`,
    `| Threshold | ${threshold}% |`,
    `| Clones found | ${total?.clones ?? 0} |`,
    `| Files scanned | ${total?.sources ?? '?'} |`,
  ];

  if (formats && typeof formats === 'object') {
    const details = Object.entries(formats).map(
      ([name, f]) =>
        `| ${name} | ${f.lines} lines | ${f.percentage.toFixed(2)}% | ${
          f.clones
        } clones |`
    );
    lines.push(
      '',
      '#### By format',
      '',
      '| Format | Lines | Duplication | Clones |',
      '| --- | ---: | ---: | ---: |',
      ...details
    );
  }

  lines.push(
    '',
    '<sub>Threshold is configured in `.jscpd.json`. After legitimately reducing duplication, ' +
      'update the threshold via `pnpm run dup-check:update` and commit `.jscpd.json`.</sub>'
  );

  return lines.join('\n');
}

function writeStepSummary(body) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  try {
    fs.appendFileSync(file, body + '\n');
  } catch (err) {
    process.stderr.write(
      `[jscpd] could not write step summary: ${err.message}\n`
    );
  }
}

function writeReportFile(body) {
  const file = process.env.DUP_REPORT_FILE;
  if (!file) return;
  try {
    fs.writeFileSync(file, body + '\n');
  } catch (err) {
    process.stderr.write(
      `[jscpd] could not write report file: ${err.message}\n`
    );
  }
}

function main() {
  const update = process.argv.includes('--update');

  if (update) {
    const result = spawnSync(
      process.execPath,
      [
        resolveJscpdBin(),
        '.',
        '--silent',
        '--reporters',
        'threshold',
        '--no-tips',
      ],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        env: { ...process.env, NO_COLOR: '1' },
        stdio: ['ignore', 'pipe', 'inherit'],
      }
    );
    const match = result.stdout?.match(/(\d+\.?\d*)%\s*duplicated lines/);
    if (match) {
      process.stdout.write(`Current duplication: ${match[1]}%\n`);
      process.stdout.write(
        `Update the "threshold" field in .jscpd.json to this value.\n`
      );
    } else {
      process.stdout.write(result.stdout ?? '');
      process.stderr.write(
        '[jscpd] could not parse duplication percentage from output.\n'
      );
    }
    process.exit(result.status ?? 0);
  }

  const configPath = path.join(process.cwd(), '.jscpd.json');
  let threshold = 0;
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    threshold = config.threshold ?? 0;
  } catch {
    process.stderr.write('[jscpd] could not read .jscpd.json\n');
    process.exit(1);
  }

  const { code, report } = runJscpd();
  if (!report?.statistics?.total) {
    const md = buildMarkdown(report, threshold);
    writeStepSummary(md);
    writeReportFile(md);
    process.stderr.write(
      `\n✗ duplication gate failed: jscpd did not produce a readable JSON report (exit ${code}).\n`
    );
    process.exit(1);
  }
  const pct = report.statistics.total.percentage ?? 0;
  const ok = pct <= threshold;

  const md = buildMarkdown(report, threshold);
  writeStepSummary(md);
  writeReportFile(md);

  process.stdout.write(
    `\njscpd: ${pct}% duplicated lines (threshold: ${threshold}%)\n`
  );

  if (ok) {
    process.stdout.write('✓ duplication gate passed\n');
    process.exit(0);
  }

  process.stderr.write(
    `\n✗ duplication gate failed: ${pct}% exceeds threshold ${threshold}%\n`
  );
  process.stderr.write(
    'Deduplicate the copied code, expand ignore globs in .jscpd.json, or raise the threshold.\n'
  );
  process.exit(1);
}

main();
