import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { BackroadComponentRenderer } from '../types/components';
import { useState } from 'react';

// const defaultData =
export const Table: BackroadComponentRenderer<'table'> = (props) => {
  const columnsHelper = createColumnHelper<any>();
  const [dataState] = useState(props.args.data);
  const table = useReactTable({
    data: dataState,
    columns: Object.entries(props.args.columns).map(([key, col]) => {
      return columnsHelper.accessor(key, col);
    }),
    // [
    //   columnsHelper.accessor('firstName', {

    //   }),
    // ]
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
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
      </table>
    </div>
  );
};
