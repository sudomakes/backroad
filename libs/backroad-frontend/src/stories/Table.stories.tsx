import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `table` renderer — drives `@tanstack/react-table` under the hood.
// `columns` maps each data key to a column def (`header`, `cell`, `footer`, …);
// `data` is the row array.
const Table = backroadClientComponents.table;
type Columns = Parameters<typeof Table>[0]['args']['columns'];
type Row = Record<string, unknown>;
const table = (columns: Columns, data: Row[]) => ({
  path: 'story',
  id: 'story',
  type: 'table' as const,
  value: null,
  args: { columns, data },
});

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Table>;

const SANDBOX_COLUMNS: Columns = {
  id: { header: 'Sandbox' },
  state: { header: 'State' },
  session: { header: 'Session' },
  vcpu: { header: 'vCPU' },
  ram: { header: 'RAM (MiB)' },
  started: { header: 'Started' },
};

const SANDBOX_DATA: Row[] = [
  {
    id: 'i90z7tggm5dvny1wib624',
    state: 'running',
    session: 'backroad-3e111f1b-e02e-4694-80e9-a89bae37d52f',
    vcpu: 4,
    ram: 8192,
    started: '2026-06-15T15:39:55.003Z',
  },
  {
    id: 'k21a8whqn4exrt7zca910',
    state: 'paused',
    session: 'backroad-9f02c3aa-1b77-4c0e-bb31-77c4e2901aa2',
    vcpu: 2,
    ram: 4096,
    started: '2026-06-15T14:02:11.880Z',
  },
  {
    id: 'p55m3dkce0wbxq2yhn183',
    state: 'running',
    session: 'backroad-12ab4f9e-77de-4a90-9c44-0e5b6d3f2c10',
    vcpu: 8,
    ram: 16384,
    started: '2026-06-15T11:48:30.512Z',
  },
];

/** Typical multi-column table with long ids that overflow horizontally. */
export const Default: Story = {
  render: () => <Table {...table(SANDBOX_COLUMNS, SANDBOX_DATA)} />,
};

/** A single row — header/row spacing without zebra context. */
export const SingleRow: Story = {
  render: () => <Table {...table(SANDBOX_COLUMNS, [SANDBOX_DATA[0]])} />,
};

/** No rows — header renders, body is empty. */
export const Empty: Story = {
  render: () => <Table {...table(SANDBOX_COLUMNS, [])} />,
};

// Footer totals precomputed from the data so the column defs stay plain values
// (react-table also accepts a `(ctx) => …` footer, but a static value is enough
// to exercise the otherwise-hidden `<tfoot>`).
const REGION_DATA: Row[] = [
  { region: 'us-east-1', running: 3, ram: 24576 },
  { region: 'eu-west-1', running: 1, ram: 8192 },
  { region: 'ap-south-1', running: 2, ram: 12288 },
];
const REGION_COLUMNS: Columns = {
  region: { header: 'Region', footer: 'Total' },
  running: {
    header: 'Running',
    footer: String(
      REGION_DATA.reduce((sum, r) => sum + (r.running as number), 0)
    ),
  },
  ram: {
    header: 'RAM (MiB)',
    footer: String(REGION_DATA.reduce((sum, r) => sum + (r.ram as number), 0)),
  },
};

/** Columns with footers render the (otherwise hidden) `<tfoot>`. */
export const WithFooter: Story = {
  render: () => <Table {...table(REGION_COLUMNS, REGION_DATA)} />,
};

// --- Stress tests -----------------------------------------------------------
// These exercise the layout limits. Wide tables stay on the `overflow-x-auto`
// wrapper so they scroll horizontally instead of blowing out the page. Tall
// tables cross the virtualization threshold and switch to a bounded scroll
// viewport that only mounts the visible window of rows.

const WIDE_COLUMN_COUNT = 40;
const WIDE_COLUMNS: Columns = Object.fromEntries(
  Array.from({ length: WIDE_COLUMN_COUNT }, (_, c) => [
    `col${c}`,
    { header: `Column ${c + 1}` },
  ])
);
const WIDE_DATA: Row[] = Array.from({ length: 12 }, (_, r) =>
  Object.fromEntries(
    Array.from({ length: WIDE_COLUMN_COUNT }, (_, c) => [
      `col${c}`,
      `r${r + 1}·c${c + 1}`,
    ])
  )
);

/** 40 columns — verifies the container scrolls horizontally instead of crushing
 * cells or overflowing the page. */
export const WideTable: Story = {
  render: () => <Table {...table(WIDE_COLUMNS, WIDE_DATA)} />,
};

const LONG_ROW_COUNT = 2000;
const STATES = ['running', 'paused', 'stopped'];
const LONG_DATA: Row[] = Array.from({ length: LONG_ROW_COUNT }, (_, i) => ({
  id: `sandbox-${String(i).padStart(5, '0')}`,
  state: STATES[i % STATES.length],
  session: `backroad-${String(i).padStart(8, '0')}-e02e-4694-80e9-a89bae37d52f`,
  vcpu: (i % 8) + 1,
  ram: ((i % 8) + 1) * 1024,
  started: `2026-06-15T${String(i % 24).padStart(2, '0')}:00:00.000Z`,
}));

/** 2,000 rows — past the virtualization threshold, so only the visible window
 * (plus overscan) mounts as DOM nodes inside a bounded scroll viewport. */
export const LongTable: Story = {
  render: () => <Table {...table(SANDBOX_COLUMNS, LONG_DATA)} />,
};

export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Table {...table(SANDBOX_COLUMNS, SANDBOX_DATA)} />
    </ThemeMatrix>
  ),
};
