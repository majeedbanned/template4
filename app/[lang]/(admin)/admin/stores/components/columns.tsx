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
import { StoreProps, UserProps } from "@/lib/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import useAddEditStoreModal from "@/app/[lang]/components/modals/AddEditStoreModal";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StoreProps>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className=" translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => {
  //         row.toggleSelected(!!value);
  //       }}
  //       aria-label="Select row"
  //       className="mx-2 "
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "pelak",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-lg font-bold" variant="outline">
          {row.getValue("pelak")}
        </Badge>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="پلاک" />
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
    accessorKey: "types_nov.nov",
    id: "types_nov.nov",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("types_nov.nov")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          نوع واحد
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">{row.getValue("name")}</div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نام واحد" />;
    },
  },
  {
    accessorKey: "metraj",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "tel1",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">pass</div>
      );
    },
  },
  {
    accessorKey: "tel2",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">tel2</div>
      );
    },
  },
  {
    accessorKey: "rent",
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          school_code
        </div>
      );
    },
  },

  {
    accessorKey: "types_bazar.bazar",
    id: "types_bazar.bazar",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("types_bazar.bazar")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">bazar</div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "types_tabagh.tabagh",
    id: "types_tabagh.tabagh",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("types_tabagh.tabagh")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">
          tabagh
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "types_rahro.rahro",
    id: "types_rahro.rahro",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("types_rahro.rahro")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return (
        <div className="flex m-0 px-0 text-purple-500 font-semibold">rahro</div>
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

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const UserRow = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={
  //               () => alert(UserRow.pelak.toString())
  //               // navigator.clipboard.writeText(UserRow.pelak.toString())
  //             }
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //           // onClick={() => handleShow(UserRow.pelak.toString())}
  //           >
  //             View customer
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
