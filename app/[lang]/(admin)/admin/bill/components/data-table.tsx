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
// import { DataTablePagination } from "./data-table-pagination";
import useAddEditStoreModal from "@/app/[lang]/components/modals/AddEditStoreModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BanknotesIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  DocumentIcon,
  PaperClipIcon,
  PlusCircleIcon,
  PrinterIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
// import { DataTableViewOptions } from "./data-table-view-options";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { DataTablePagination } from "../../stores/components/data-table-pagination";
import { DataTableViewOptions } from "../../stores/components/data-table-view-options";
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
  onActionClick: (id: any) => void;
  onDeleteClick: (id: any) => void;
  onPrintClick: (id: any) => void;
  onPaymentClick: (id: any) => void;
  allowEdit?: boolean;
  allowDelete?: boolean;
  hiddenCol: VisibilityState;
  showPrint?: boolean;
  onChargeClick?: (id: any) => void;
  onFileClick?: (id: any, id1: any) => void;
  onNewFileClick?: (id: any, id1: any) => void;
  docadd?: boolean;
  formattedDate: string;
  docview?: boolean;
  docedit?: boolean;

  onOwnerClick?: (id: any) => void;
  onTenantClick?: (id: any) => void;
  onRobClick?: (id: any) => void;
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  ////console.log("fuzzy");
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
  formattedDate,
  isLoading,
  onActionClick,
  onDeleteClick,
  onPrintClick,
  onPaymentClick,
  showPrint,
  allowEdit,
  allowDelete,
  hiddenCol,
  onTenantClick,
  onRobClick,
  onFileClick,
  onNewFileClick,
  docadd,
  docview,
  docedit,

  onChargeClick,
  onOwnerClick,
}: DataTableProps<TData, TValue>) {
  const AddUserModal = useAddEditStoreModal();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    ////console.log("rs>", rowSelection);
    ////console.log("rs>", table.getSelectedRowModel().flatRows);
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

  function convertToFarsiDigits(value: any) {
    // Ensure we are working with a string
    const strValue = value.toString();

    // Replace each English digit with its Farsi counterpart
    return strValue.replace(/\d/g, (digit: any) => {
      return "۰۱۲۳۴۵۶۷۸۹"[digit];
    });
  }

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
                <th className="text-primaryText text-right pr-6">منو</th>
                {/* {row.original.list && ( */}
                {false && onNewFileClick && docview && (
                  <th className="text-primaryText text-right pr-6">اسناد</th>
                )}{" "}
                {/* )} */}
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
              table.getRowModel().rows.map((row, inx) => (
                <TableRow
                  key={row.id}
                  className="p-3  "
                  data-state={row.getIsSelected() && "selected"}
                >
                  <td className="px-4 py-2">
                    {inx === 0 &&
                      row.original.settele_Status !== "Ok" &&
                      row.original.paidBill !== row.original.TotalBill &&
                      convertToFarsiDigits(row.original.month) ===
                        formattedDate && (
                        <Button
                          onClick={() => onPaymentClick(row.original)}
                          variant="default"
                          className="bg-green-400"
                        >
                          {/* {convertToFarsiDigits(row.original.month)}
                          {formattedDate} */}
                          پرداخت آنلاین
                          {/* <br /> */}
                          {/* {row.original.TotalBill - row.original.paidBill} */}
                        </Button>
                      )}

                    {showPrint && (
                      <Button
                        onClick={() => onPrintClick(row.original)}
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        {/* <span className="sr-only">Open menu</span> */}
                        <PrinterIcon className="h-5 w-5" />
                      </Button>
                    )}
                  </td>
                  {false && row.original.list && docview && (
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            {/* <span className="sr-only">Open menu</span> */}
                            <PaperClipIcon className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="bordercolor"
                          align="end"
                        >
                          {docadd && (
                            <>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                                  <span>افزودن سند</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="left-[45px] ">
                                    {row.original.list?.map(
                                      (
                                        type: { id: number; title: string },
                                        index: number
                                      ) => {
                                        return (
                                          <DropdownMenuItem
                                            key={index}
                                            className="flex justify-end gap-2"
                                            //

                                            onClick={() =>
                                              onNewFileClick &&
                                              onNewFileClick(
                                                row.original,
                                                type.id
                                              )
                                            }
                                          >
                                            {type.title}
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                          </DropdownMenuItem>
                                        );
                                      }
                                    )}
                                    {/* <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>Message</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>More...</span>
                              </DropdownMenuItem> */}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                            </>
                          )}

                          {row.original.Doc_files?.map(
                            (
                              type: { id: number; Doc_cat: { title: string } },
                              index: number
                            ) => {
                              return (
                                <DropdownMenuItem
                                  key={index}
                                  className="flex justify-end gap-2"
                                  //

                                  onClick={() =>
                                    onFileClick &&
                                    onFileClick(row.original, type.id)
                                  }
                                >
                                  {type.Doc_cat.title}
                                  <DocumentIcon className="w-4 h-4"></DocumentIcon>
                                </DropdownMenuItem>
                              );
                            }
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="m-0 p-2 " key={cell.id}>
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
