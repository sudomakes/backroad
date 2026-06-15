import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { BackroadComponentRenderer } from '../types/components';

// Past this many rows we stop rendering every <tr> and switch to a fixed-height
// scroll viewport that only mounts the visible window (plus overscan). Smaller
// tables render naturally so their height tracks content and the page scrolls
// as one — no nested scrollbar, no sticky header.
const VIRTUALIZE_THRESHOLD = 100;
// px estimate for a row (py-2.5 + text-sm line). Only a seed — measureElement
// corrects it from the real DOM, so variable-height rows still scroll cleanly.
const ESTIMATED_ROW_HEIGHT = 41;

const HEADER_CELL_CLASS =
  'whitespace-nowrap px-4 py-2.5 text-left align-middle font-medium text-muted-foreground';

export const Table: BackroadComponentRenderer<'table'> = (props) => {
  const columnsHelper = createColumnHelper<any>();
  const table = useReactTable({
    data: props.args.data,
    columns: Object.entries(props.args.columns).map(([key, col]) => {
      return columnsHelper.accessor(key, col);
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const virtualize = rows.length > VIRTUALIZE_THRESHOLD;
  const hasFooter = table
    .getAllColumns()
    .some((column) => column.columnDef.footer !== undefined);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 12,
    enabled: virtualize,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  const renderRow = (row: (typeof rows)[number], virtualIndex?: number) => (
    <tr
      key={row.id}
      data-index={virtualIndex}
      ref={virtualize ? rowVirtualizer.measureElement : undefined}
      className="border-b border-border transition-colors hover:bg-muted/50"
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-2.5 align-middle">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );

  return (
    <div
      ref={scrollRef}
      className={`w-full rounded-lg border border-border bg-card text-card-foreground shadow-sm ${
        virtualize ? 'max-h-[70vh] overflow-auto' : 'overflow-x-auto'
      }`}
    >
      <table className="w-full border-collapse text-sm">
        <thead
          className={`bg-muted text-muted-foreground ${
            virtualize ? 'sticky top-0 z-10' : ''
          }`}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={HEADER_CELL_CLASS}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualize ? (
            <>
              {paddingTop > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={columnCount} style={{ height: paddingTop }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) =>
                renderRow(rows[virtualRow.index], virtualRow.index)
              )}
              {paddingBottom > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={columnCount} style={{ height: paddingBottom }} />
                </tr>
              )}
            </>
          ) : (
            rows.map((row) => renderRow(row))
          )}
        </tbody>
        {hasFooter && (
          <tfoot
            className={`border-t border-border bg-muted text-muted-foreground ${
              virtualize ? 'sticky bottom-0 z-10' : ''
            }`}
          >
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id} className={HEADER_CELL_CLASS}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};
