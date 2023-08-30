"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
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
    id: "پلاک",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-lg bordercolor font-bold" variant="outline">
          {row.getValue("پلاک")}
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
    id: "نوع واحد",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("نوع واحد")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نوع واحد" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "name",
    id: "نام واحد",

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {row.getValue("نام واحد")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نام واحد" />;
    },
  },
  {
    accessorKey: "metraj",
    id: "متراژ",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="متراژ" />
    ),
  },
  {
    accessorKey: "tel1",
    id: "تلفن",

    header: ({ column }) => {
      return <div className="flex m-0 px-0  font-semibold">تلفن</div>;
    },
  },

  {
    accessorKey: "ejareh",
    id: "اجاره ماهیانه",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("اجاره ماهیانه"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <Badge variant={"outline"} className="rounded-sm text-sm text-blue-400">
          {formatted.replace("ریال", "")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اجاره ماهیانه" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "chargeDef.name",
    id: "تعرفه پرداخت",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("تعرفه پرداخت")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعرفه پرداخت" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "types_bazar.bazar",
    id: "بلوک",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("بلوک")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بلوک" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "types_tabagh.tabagh",
    id: "تراز",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("تراز")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تراز" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "types_rahro.rahro",
    id: "راهرو",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("راهرو")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="راهرو" />
    ),
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
];
