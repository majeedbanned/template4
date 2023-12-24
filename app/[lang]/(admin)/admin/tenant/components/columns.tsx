"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Tenantschema } from "@/lib/schemas";
export const columns: ColumnDef<z.infer<typeof Tenantschema>>[] = [
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
    id: "نام خانوادگی",

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {row.getValue("نام خانوادگی")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نام خانوادگی" />;
    },
  },

  {
    accessorKey: "tmeli",
    id: "کد ملی",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کد ملی" />
    ),
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
    id: "وکیل/ نماینده",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("وکیل/ نماینده")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="وکیل/ نماینده" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "tjob",
    id: "صنف",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("صنف")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="صنف" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "stdate",
    id: "شروع قرارداد",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("شروع قرارداد")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="شروع قرارداد"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "endate",
    id: "پایان قرارداد",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("پایان قرارداد")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="پایان قرارداد"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "datemojavez",
    id: "تاریخ مجوز کاربری",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("تاریخ مجوز کاربری")}
        </Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="تاریخ مجوز کاربری"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
