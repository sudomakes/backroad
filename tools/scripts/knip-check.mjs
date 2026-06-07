#!/usr/bin/env node
// Knip baseline ratchet. Counts every array-valued category knip emits
// per issue, sums across issues, and compares to knip-baseline.json.
// Fails on any category that went up.
//
// Categories are NOT hard-coded — they're discovered from knip's actual
// output, plus the union of whatever's already in the baseline. If knip
// adds a new category (e.g. a future `nxImplicitDeps`), the gate picks
// it up automatically; if knip drops one, we still track its baseline
// value (defaulting current to 0).
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASELINE_PATH = join(process.cwd(), 'knip-baseline.json');

const result = spawnSync(
  'pnpm',
  ['knip', '--reporter', 'json', '--no-progress'],
  {
    encoding: 'utf8',
  }
);

// Knip exits non-zero when it finds anything — that's fine, we still parse.
const stdout = result.stdout || '';
const jsonStart = stdout.indexOf('{"issues"');
if (jsonStart === -1) {
  console.error('knip did not emit JSON output');
  console.error(result.stderr);
  process.exit(1);
}
const report = JSON.parse(stdout.slice(jsonStart).split('\n')[0]);

// Discover counts dynamically: for every issue, every key whose value is
// an array contributes its length to that key's total. Non-array fields
// like `file` (a string identifier) are skipped.
const counts = {};
for (const issue of report.issues) {
  for (const [key, value] of Object.entries(issue)) {
    if (!Array.isArray(value)) continue;
    counts[key] = (counts[key] ?? 0) + value.length;
  }
}

const writeMode = process.argv.includes('--write');
if (writeMode) {
  const sorted = Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
  );
  writeFileSync(BASELINE_PATH, JSON.stringify(sorted, null, 2) + '\n');
  console.log('Wrote knip-baseline.json:');
  console.log(JSON.stringify(sorted, null, 2));
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  console.error(
    'knip-baseline.json missing. Generate one with: pnpm run knip:baseline'
  );
  process.exit(1);
}
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));

// Compare across the union of categories — anything the baseline tracks
// + anything the current run produced. Either side missing is treated as 0.
const allCategories = [
  ...new Set([...Object.keys(baseline), ...Object.keys(counts)]),
].sort();

const lines = [];
const regressions = [];
for (const c of allCategories) {
  const cur = counts[c] ?? 0;
  const base = baseline[c] ?? 0;
  const delta = cur - base;
  const marker = delta > 0 ? 'x' : delta < 0 ? 'v' : '=';
  const isNew = !(c in baseline) ? '  (new)' : '';
  lines.push(
    `  [${marker}] ${c.padEnd(26)} current=${cur}  baseline=${base}  delta=${
      delta >= 0 ? '+' : ''
    }${delta}${isNew}`
  );
  if (delta > 0) regressions.push({ category: c, cur, base, delta });
}

console.log('Knip baseline check:');
console.log(lines.join('\n'));

// Optional markdown report for the PR sticky comment. CI sets
// KNIP_REPORT_FILE; locally this is unset and no file is written.
if (process.env.KNIP_REPORT_FILE) {
  const verdict =
    regressions.length === 0
      ? 'no regressions'
      : `${regressions.length} regression(s)`;
  const tableHeader =
    '| Category | Baseline | Current | Δ |\n|---|---:|---:|---:|';
  const tableRows = allCategories
    .map((c) => {
      const cur = counts[c] ?? 0;
      const base = baseline[c] ?? 0;
      const delta = cur - base;
      const sign = delta > 0 ? '+' : delta < 0 ? '' : '±';
      const tag = !(c in baseline) ? ' _(new)_' : '';
      return `| ${c}${tag} | ${base} | ${cur} | ${sign}${delta} |`;
    })
    .join('\n');
  const md = [
    '<!-- knip-report -->',
    `### Knip dead-code gate — ${verdict}`,
    '',
    tableHeader,
    tableRows,
    '',
    regressions.length === 0
      ? '_All counts at or below baseline._'
      : '⚠️ Run `pnpm run knip` locally for the offending items. Either fix them, or regenerate the baseline with `pnpm run knip:baseline` (only when net-removing dead code).',
  ].join('\n');
  writeFileSync(process.env.KNIP_REPORT_FILE, md + '\n');
}

if (regressions.length > 0) {
  console.error('\nRegressions vs baseline:');
  for (const r of regressions) {
    console.error(`  - ${r.category}: ${r.base} → ${r.cur} (+${r.delta})`);
  }
  console.error(
    '\nRun `pnpm run knip` locally to see the offending items. Either fix them, or — if intentional — regenerate the baseline with `pnpm run knip:baseline` (only when net-removing dead code).'
  );
  process.exit(1);
}

console.log('\nNo regressions.');
