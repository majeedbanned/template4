"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Ownerschema, Userschema } from "@/lib/schemas";
export const columns: ColumnDef<z.infer<typeof Userschema>>[] = [
  {
    accessorKey: "name",
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
    accessorKey: "lname",
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
    accessorKey: "username",
    id: "نام کاربری",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام کاربری" />
    ),
  },
  {
    accessorKey: "password",
    id: "کلمه عبور",

    header: ({ column }) => {
      return <div className="flex m-0 px-0  font-semibold"> کلمه عبور</div>;
    },
  },

  {
    accessorKey: "role",
    id: "نقش",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("نقش")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نقش" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "active",
    id: "وضعیت",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("وضعیت") === true ? "فعال" : "غیر فعال"}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="وضعیت" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
