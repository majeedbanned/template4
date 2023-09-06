"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Chargedefschema, Ownerschema, Userschema } from "@/lib/schemas";
export const columns: ColumnDef<z.infer<typeof Chargedefschema>>[] = [
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
    accessorKey: "type",
    id: "نوع تعرفه",
    cell: ({ row }) => {
      return (
        <Badge className="rounded-sm" variant="secondary">
          {row.getValue("نوع تعرفه") === "1" ? "هر متر" : "ثابت"}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نوع تعرفه" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "charge",
    id: "مبلغ شارژ",

    cell: ({ row }) => {
      const charge = parseFloat(row.getValue("مبلغ شارژ"));
      const formattedch = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(charge);
      return (
        <div className="text-slate-600 font-medium">
          {formattedch.replace("ریال", "")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="مبلغ شارژ" />;
    },
  },
  {
    accessorKey: "penaltyMonth",
    id: "ماه جریمه",
    cell: ({ row }) => {
      const charge = parseFloat(row.getValue("ماه جریمه"));
      const formattedch = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(charge);
      return (
        <div className="text-slate-600 font-medium">
          {formattedch.replace("ریال", "")}
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ماه جریمه" />
    ),
  },
  {
    accessorKey: "penaltyPersand",
    id: "درصد جریمه",
    cell: ({ row }) => {
      const charge = parseFloat(row.getValue("درصد جریمه"));
      const formattedch = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(charge);
      return (
        <div className="text-slate-600 font-medium">
          {formattedch.replace("ریال", "")}
        </div>
      );
    },
    header: ({ column }) => {
      return <div className="flex m-0 px-0  font-semibold"> درصد جریمه</div>;
    },
  },
];
