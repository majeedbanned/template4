"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  FilterFn,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./data-table-pagination";
import useAddEditStoreModal from "@/app/[lang]/components/modals/AddEditStoreModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DataTableViewOptions } from "./data-table-view-options";
import { Edit3 } from "lucide-react";
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  onActionClick: (pelak: string, id: string) => void;
  onDeleteClick: (id: any) => void;
  allowEdit?: boolean;
  allowDelete?: boolean;
  hiddenCol: VisibilityState;
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  console.log("fuzzy");
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onActionClick,
  onDeleteClick,
  allowEdit,
  allowDelete,
  hiddenCol,
}: DataTableProps<TData, TValue>) {
  const AddUserModal = useAddEditStoreModal();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    console.log("rs>", rowSelection);

    console.log("rs>", table.getSelectedRowModel().flatRows);
  }, [rowSelection]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hiddenCol);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    filterFns: {
      fuzzy: fuzzyFilter,
    },

    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      sorting,
      columnFilters,

      globalFilter,
      rowSelection,
    },
  });

  return (
    <div className=" space-y-4 w-full ">
      <div className="flex space-y-0 items-center py-0"></div>
      {/* <DataTableToolbar table={table} /> */}
      <div className="relative">
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md bordercolor border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <th className="text-primaryText">منو</th>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="p-0" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="p-3  "
                  data-state={row.getIsSelected() && "selected"}
                >
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {/* <span className="sr-only">Open menu</span> */}
                          <Cog6ToothIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bordercolor" align="end">
                        {/* <DropdownMenuLabel>ویرایش</DropdownMenuLabel> */}
                        {allowEdit && (
                          <DropdownMenuItem
                            className="flex justify-end gap-2"
                            onClick={() =>
                              onActionClick(row.original.pelak, row.original.id)
                            }
                          >
                            ویرایش
                            <Edit3 className="w-4 h-4"></Edit3>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {allowDelete && (
                          <DropdownMenuItem
                            className="flex justify-end gap-2"
                            onClick={() => onDeleteClick(row.original)}
                          >
                            حذف
                            <TrashIcon className="w-4 h-4"></TrashIcon>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="m-0 p-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <div className="flex items-center justify-end gap-2 py-4"></div>
    </div>
  );
}

// function DebouncedInput({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number;
//   onChange: (value: string | number) => void;
//   debounce?: number;
// } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
//   const [value, setValue] = React.useState(initialValue);

//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value);
//     }, debounce);

//     return () => clearTimeout(timeout);
//   }, [value]);

//   return (
//     <input
//       {...props}
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//     />
//   );
// }
