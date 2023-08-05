"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../stores/components/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const columns: ColumnDef<StoreProps>[] = [
  {
    meta: true,
    accessorKey: "id",
    id: "کد",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <Badge
            className="text-center w-fit rounded-lg bordercolor font-bold"
            variant="outline"
          >
            {row.getValue("کد")}
          </Badge>
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کد" />
    ),
  },

  {
    meta: true,
    accessorKey: "pelak",
    id: "پلاک",
    cell: ({ row }) => {
      let val = String(row.getValue("ماه"));
      return (
        <div className="flex flex-col gap-1">
          <Badge
            className="text-center w-fit rounded-lg bordercolor font-bold"
            variant="outline"
          >
            {row.getValue("پلاک")}
          </Badge>
          <Badge className="rounded-sm w-fit" variant="secondary">
            {val.toPersianDigits()}
          </Badge>
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="پلاک" />
    ),
  },

  {
    accessorKey: "month",
    id: "ماه",
    cell: ({ row }) => {
      // console.log((123.9).toLocaleString('ar-AE'))
      let val = String(row.getValue("ماه"));

      return (
        <Badge className="rounded-sm" variant="secondary">
          {val.toPersianDigits()}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ماه" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "monthbill",
    id: "شارژ ماهیانه",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("شارژ ماهیانه"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      const bedehi = parseFloat(row.getValue("بدهی قبلی"));
      const formattedbedehi = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(bedehi);

      const jarime = parseFloat(row.getValue("جریمه"));
      const formattedjarime = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(jarime);

      return (
        <div className="flex gap-1 flex-col text-right font-medium">
          <span>{formatted.replace("ریال", "")}</span>
          <Badge variant={"secondary"} className="text-sm rounded-sm w-fit">
            {formattedbedehi.replace("ریال", "") + " بدهی "}
          </Badge>
          <Badge variant={"secondary"} className="text-sm rounded-sm w-fit">
            {formattedjarime.replace("ریال", "") + " جریمه "}
          </Badge>
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="شارژ ماهیانه" />;
    },
  },

  {
    accessorKey: "discount",
    id: "تخفیف",

    cell: ({ row }) => {
      const extra = parseFloat(row.getValue("بستانکاراز قبل"));
      const formattedextra = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(extra);

      const amount = parseFloat(row.getValue("تخفیف"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="flex flex-col gap-1">
          <Badge
            variant={"secondary"}
            className="text-red-500 text-sm dark:bg-[#1e293c] dark:text-red-400 rounded-sm w-fit"
          >
            {formatted.replace("ریال", "") + "تخفیف"}
          </Badge>

          <Badge
            variant={"secondary"}
            className="text-red-500 text-sm dark:bg-[#1e293c] dark:text-red-400 rounded-sm w-fit"
          >
            {formattedextra.replace("ریال", "") + "بستانکاراز قبل"}
          </Badge>
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          className="text-[#ED5E3F]"
          column={column}
          title="کسورات"
        />
      );
    },
  },
  {
    accessorKey: "debt",
    id: "بدهی قبلی",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("بدهی قبلی"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="text-right font-medium">
          {formatted.replace("ریال", "")}
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بدهی قبلی" />
    ),
  },

  {
    accessorKey: "penalty",
    id: "جریمه",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("جریمه"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="text-right font-medium">
          {formatted.replace("ریال", "")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="جریمه" />;
    },
  },
  {
    accessorKey: "deptPeriod",
    id: "دوره جریمه",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("دوره جریمه"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="text-center font-medium">
          {formatted.replace("ریال", "")}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="دوره جریمه" />;
    },
  },

  {
    accessorKey: "TotalBill",
    id: "قابل پرداخت",

    cell: ({ row }) => {
      let val = String(row.getValue("مهلت پرداخت"));

      const amount = parseFloat(row.getValue("قابل پرداخت"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="flex flex-col gap-1">
          <Badge
            className="rounded-lg w-fit bordercolor text-sm bg-[#6cd46c] border-0 text-[#ffffff] font-bold"
            variant="outline"
          >
            {formatted.replace("ریال", "")}
          </Badge>
          <span className="text-[11px] text-slate-400">مهلت پرداخت:</span>
          {val.toString().trim() && (
            <Badge className="rounded-sm w-fit" variant="secondary">
              {val.toPersianDigits()}
            </Badge>
          )}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="قابل پرداخت" />;
    },
  },

  {
    accessorKey: "paidBill",
    id: "پرداخت شده",

    cell: ({ row }) => {
      let val = String(row.getValue("تاریخ پرداخت"));

      const amount = parseFloat(row.getValue("پرداخت شده"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="flex flex-col gap-1">
          <Badge
            className="rounded-lg w-fit bordercolor text-sm bg-white  border-[#6cd46c] border text-slate-600 font-bold"
            variant="outline"
          >
            {formatted.replace("ریال", "")}
          </Badge>
          <span className="text-[11px] text-slate-400">تاریخ پرداخت:</span>
          {val.toString().trim() && (
            <Badge className="rounded-sm w-fit" variant="secondary">
              {val.toPersianDigits()}
            </Badge>
          )}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="پرداخت شده" />;
    },
  },

  {
    accessorKey: "paidDate",
    id: "تاریخ پرداخت",
    cell: ({ row }) => {
      // console.log((123.9).toLocaleString('ar-AE'))
      let val = String(row.getValue("تاریخ پرداخت"));

      return (
        <Badge className="rounded-sm" variant="secondary">
          {val.toPersianDigits()}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="تاریخ پرداخت" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "deadline",
    id: "مهلت پرداخت",
    cell: ({ row }) => {
      let val = String(row.getValue("مهلت پرداخت"));

      return (
        <Badge className="rounded-sm" variant="secondary">
          {val.toPersianDigits()}
        </Badge>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="مهلت پرداخت" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "paidType",
    id: "نوع پرداخت",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("اضافه پرداخت"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      let val = String(row.getValue("نوع پرداخت"));

      return (
        <div className="flex flex-col gap-1">
          {val.toString().trim() && (
            <Badge className="rounded-sm w-fit" variant="secondary">
              {"نوع پرداخت" + " : " + val}
            </Badge>
          )}
          {formatted.replace("ریال", "").toString().trim() && (
            <Badge className="rounded-sm w-fit" variant="secondary">
              {"مانده بستانکاری" + " : " + formatted.replace("ریال", "")}
            </Badge>
          )}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="اطلاعات پرداخت" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "paidExtra",
    id: "بستانکاراز قبل",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("بستانکاراز قبل"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        <div className="text-right font-medium">
          {formatted.replace("ریال", "")}
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بستانکاراز قبل" />
    ),
  },

  {
    accessorKey: "paidExtraAsset",
    id: "اضافه پرداخت",

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("اضافه پرداخت"));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(amount);

      return (
        // <HoverCard>
        //   <HoverCardTrigger>Hover</HoverCardTrigger>
        //   <HoverCardContent>
        //     The React Framework – created and maintained by @vercel.
        //   </HoverCardContent>
        // </HoverCard>
        <div className="text-right font-medium">
          {formatted.replace("ریال", "")}
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اضافه پرداخت" />
    ),
  },

  {
    accessorKey: "discription",
    id: "توضیحات",

    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("توضیحات") != "" ? (
            <HoverCard openDelay={200}>
              <HoverCardTrigger>
                <InformationCircleIcon className="w-6 h-6 cursor-pointer"></InformationCircleIcon>
              </HoverCardTrigger>
              <HoverCardContent>{row.getValue("توضیحات")}</HoverCardContent>
            </HoverCard>
          ) : (
            <div></div>
          )}
        </div>
      );
    },

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="توضیحات" />
    ),
  },
];
