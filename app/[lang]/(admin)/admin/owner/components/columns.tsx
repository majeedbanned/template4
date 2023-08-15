"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Ownerschema } from "@/lib/schemas";
export const columns: ColumnDef<z.infer<typeof Ownerschema>>[] = [
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
  },

  {
    accessorKey: "tfname",
    id: "نام",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("نام")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نام" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "tlname",
    id: "فامیل",

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {row.getValue("فامیل")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="فامیل" />;
    },
  },
  {
    accessorKey: "tmobile",
    id: "موبایل",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="موبایل" />
    ),
  },
  {
    accessorKey: "tfather",
    id: "نام پدر",

    header: ({ column }) => {
      return <div className="flex m-0 px-0  font-semibold">نام پدر</div>;
    },
  },

  {
    accessorKey: "ttel",
    id: "تلفن",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("تلفن")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تلفن" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "tjob",
    id: "شغل",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("شغل")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شغل" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
