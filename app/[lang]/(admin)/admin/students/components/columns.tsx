"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { UserProps } from "@/lib/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className=" translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
        className="mx-2 "
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mahd_name",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title=" نام آموزشگاه" />
    ),
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       className="flex m-0 px-0"
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >

    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
  },
  {
    accessorKey: "domdom",

    header: ({ column }) => {
      return (
        <Button
          className="flex m-0 px-0 text-purple-500 font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          mahd_name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "pass",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">pass</div>
      );
    },
  },
  {
    accessorKey: "rooztavalod",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          rooztavalod
        </div>
      );
    },
  },
  {
    accessorKey: "school_code",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          school_code
        </div>
      );
    },
  },

  {
    accessorKey: "maghtatbl.name",
    id: "maghtatbl.name",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          maghtatxt
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // {
  //   accessorKey: "username",
  //   header: () => <div className="text-right">username</div>,

  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       //fa-IR
  //       style: "currency",
  //       currency: "USD", //IRR
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => {
      const UserRow = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(UserRow.id.toString())
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
