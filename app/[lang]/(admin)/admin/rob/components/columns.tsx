"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Robschema, Tenantschema } from "@/lib/schemas";
export const columns: ColumnDef<z.infer<typeof Robschema>>[] = [
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
    accessorKey: "invitedate",
    id: "تاریخ دعوتنامه",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("تاریخ دعوتنامه")}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="تاریخ دعوتنامه" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paydiscription",
    id: "توضیحات پرداخت",

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {row.getValue("توضیحات پرداخت")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="توضیحات پرداخت" />;
    },
  },
  {
    accessorKey: "paydate",
    id: "تاریخ پرداخت",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ پرداخت" />
    ),
  },
  {
    accessorKey: "price",
    id: "مبلغ",

    header: ({ column }) => {
      return <div className="flex m-0 px-0  font-semibold">مبلغ </div>;
    },
  },

  {
    accessorKey: "disc",
    id: "توضیحات",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("توضیحات")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="توضیحات" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
