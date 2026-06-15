import { render } from '@testing-library/react';
import { backroadClientComponents } from 'backroad-components';

// Test the real `table` renderer the backroad tree mounts (drives
// @tanstack/react-table + @tanstack/react-virtual), so the tests track what
// actually ships.
const Table = backroadClientComponents.table;
type Columns = Parameters<typeof Table>[0]['args']['columns'];
type Row = Record<string, unknown>;
const tableProps = (columns: Columns, data: Row[]) => ({
  path: 'test',
  id: 'test',
  type: 'table' as const,
  value: null,
  args: { columns, data },
});

const COLUMNS: Columns = {
  id: { header: 'Sandbox' },
  state: { header: 'State' },
};

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `sandbox-${String(i).padStart(5, '0')}`,
    state: i % 2 === 0 ? 'running' : 'paused',
  }));

// tbody rows excluding the aria-hidden spacer rows the virtualizer injects.
const dataRows = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr')).filter(
    (tr) => tr.getAttribute('aria-hidden') !== 'true'
  );

describe('Table', () => {
  it('renders column headers', () => {
    const { getByText } = render(
      <Table {...tableProps(COLUMNS, makeRows(3))} />
    );
    expect(getByText('Sandbox')).toBeTruthy();
    expect(getByText('State')).toBeTruthy();
  });

  it('renders cell content for each row', () => {
    const { getByText } = render(
      <Table {...tableProps(COLUMNS, makeRows(3))} />
    );
    expect(getByText('sandbox-00000')).toBeTruthy();
    expect(getByText('sandbox-00002')).toBeTruthy();
  });

  it('renders an empty body when there is no data', () => {
    const { container } = render(<Table {...tableProps(COLUMNS, [])} />);
    expect(dataRows(container)).toHaveLength(0);
    // Header still present.
    expect(container.querySelector('thead th')).toBeTruthy();
  });

  it('omits <tfoot> when no column defines a footer', () => {
    const { container } = render(
      <Table {...tableProps(COLUMNS, makeRows(3))} />
    );
    expect(container.querySelector('tfoot')).toBeNull();
  });

  it('renders <tfoot> when a column defines a footer', () => {
    const withFooter: Columns = {
      id: { header: 'Sandbox', footer: 'Total' },
      state: { header: 'State' },
    };
    const { container, getByText } = render(
      <Table {...tableProps(withFooter, makeRows(3))} />
    );
    expect(container.querySelector('tfoot')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
  });

  // The gate between "render every row" and "virtualize" is what we can assert
  // deterministically. The actual windowed row count depends on real layout
  // measurement, which jsdom doesn't provide (every rect is 0×0) — that's
  // covered by the Storybook `LongTable` story / visual check, not here.
  describe('virtualization gate', () => {
    const wrapper = (container: HTMLElement) =>
      container.firstElementChild as HTMLElement;
    const thead = (container: HTMLElement) =>
      container.querySelector('thead') as HTMLElement;

    it('renders naturally at the threshold (no scroll viewport)', () => {
      const { container } = render(
        <Table {...tableProps(COLUMNS, makeRows(100))} />
      );
      // All rows present, no spacer rows.
      expect(dataRows(container)).toHaveLength(100);
      expect(
        container.querySelectorAll('tbody tr[aria-hidden="true"]')
      ).toHaveLength(0);
      // Page-flow layout: horizontal overflow only, no bounded height, header
      // not sticky.
      expect(wrapper(container).className).toContain('overflow-x-auto');
      expect(wrapper(container).className).not.toContain('max-h-');
      expect(thead(container).className).not.toContain('sticky');
    });

    it('switches to a bounded scroll viewport past the threshold', () => {
      const { container } = render(
        <Table {...tableProps(COLUMNS, makeRows(101))} />
      );
      expect(wrapper(container).className).toContain('max-h-[70vh]');
      expect(wrapper(container).className).toContain('overflow-auto');
      // Sticky header so it survives scrolling the windowed rows.
      expect(thead(container).className).toContain('sticky');
    });
  });

  // jsdom has no layout engine, so @tanstack/react-virtual sees 0×0 for every
  // element and renders an empty window. The virtualizer reads the viewport and
  // row sizes from `offsetHeight` (synchronously — no ResizeObserver needed for
  // the initial measure), so feeding realistic values lets us assert the actual
  // windowing: that only a fraction of rows mount as DOM nodes.
  describe('windowing (with mocked layout geometry)', () => {
    const ROW_H = 40;
    const VIEWPORT_H = 700;
    let originalOffsetHeight: PropertyDescriptor | undefined;
    let originalOffsetWidth: PropertyDescriptor | undefined;

    beforeAll(() => {
      originalOffsetHeight = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetHeight'
      );
      originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetWidth'
      );
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get(this: HTMLElement) {
          // Rows report a real height; the scroll viewport reports its height.
          return this.tagName === 'TR' ? ROW_H : VIEWPORT_H;
        },
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: () => 800,
      });
    });

    afterAll(() => {
      if (originalOffsetHeight) {
        Object.defineProperty(
          HTMLElement.prototype,
          'offsetHeight',
          originalOffsetHeight
        );
      }
      if (originalOffsetWidth) {
        Object.defineProperty(
          HTMLElement.prototype,
          'offsetWidth',
          originalOffsetWidth
        );
      }
    });

    it('mounts only a small window of a 2,000-row table', () => {
      const total = 2000;
      const { container } = render(
        <Table {...tableProps(COLUMNS, makeRows(total))} />
      );
      const rendered = dataRows(container).length;
      // ~viewport/row + overscan worth of rows, nowhere near the full 2,000.
      const maxExpected = Math.ceil(VIEWPORT_H / ROW_H) + 12 * 2 + 5;
      expect(rendered).toBeGreaterThan(0);
      expect(rendered).toBeLessThanOrEqual(maxExpected);
    });

    it('renders the rows at the top of the scroll offset, not the bottom', () => {
      const { getByText, queryByText } = render(
        <Table {...tableProps(COLUMNS, makeRows(2000))} />
      );
      // scrollTop is 0, so the first row is mounted and a far-down row is not.
      expect(getByText('sandbox-00000')).toBeTruthy();
      expect(queryByText('sandbox-01999')).toBeNull();
    });

    it('injects spacer rows to preserve total scroll height', () => {
      const { container } = render(
        <Table {...tableProps(COLUMNS, makeRows(2000))} />
      );
      // At scrollTop 0 there's no top spacer, but a bottom spacer holds the
      // height of the ~1,960 un-mounted rows.
      const spacers = container.querySelectorAll(
        'tbody tr[aria-hidden="true"]'
      );
      expect(spacers.length).toBeGreaterThan(0);
    });
  });
});
