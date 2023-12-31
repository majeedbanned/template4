"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoreProps } from "@/lib/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Divide } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <Badge
          className="rounded-lg whitespace-nowrap bordercolor font-bold"
          variant="outline"
        >
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
        <div className="flex flex-col items-center justify-center gap-2">
          <Badge className="rounded-sm" variant="secondary">
            {row.getValue("نوع واحد")}
          </Badge>
          <Badge className="rounded-sm" variant="secondary">
            {row.getValue("وضعیت")?.toString() === "true" ? "فعال" : "غیر فعال"}
          </Badge>
        </div>
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
    accessorKey: "aghsat",
    id: "نحوه",

    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-white text-[12px] rounded-md flex justify-center items-center font-medium bg-yellow-500">
            {row.getValue("نحوه")?.toString() === "true" ? " اقساطی" : ""}
          </div>
          <div className="text-white text-[12px] rounded-md flex justify-center items-center font-medium bg-green-500">
            {row.getValue("تجمیع")?.toString() === "true" ? " تجمیع" : ""}
          </div>
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="نحوه" />;
    },
  },

  {
    accessorKey: "tajmi",
    id: "تجمیع",

    cell: ({ row }) => {
      return (
        <div className="text-white text-[12px] rounded-md flex justify-center items-center font-medium bg-yellow-500">
          {row.getValue("تجمیع")?.toString() === "true" ? " تجمیع" : ""}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="تجمیع" />;
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
    accessorKey: "active",
    id: "وضعیت",

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {row.getValue("وضعیت")?.toString() === "true" ? "فعال" : "غیر فعال"}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="وضعیت" />;
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
    id: "تعرفه ثابت",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("تعرفه ثابت"));
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
      <DataTableColumnHeader column={column} title="تعرفه ثابت" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "chargeDef.name",
    id: "تعرفه شارژ",
    cell: ({ row }) => {
      const ttype = row.getValue("نوع تعرفه");
      let amount = 0;
      if (ttype == "2") amount = row.getValue("تعرفه");
      else
        amount =
          parseFloat(row.getValue("تعرفه")) * parseFloat(row.getValue("متراژ"));

      let takhfif = 0;
      // takhfif += row.getValue("تخفیف").map((item, i: number) => {
      //   return item.discountPersand;
      // });
      //@ts-ignore

      takhfif = row.getValue("تخفیف").reduce(function (s, a) {
        return s + parseFloat(a.discountDef.discountPersand);
      }, 0);

      const tkh = (takhfif / 100) * Number(amount.toFixed(0));
      const mablagh = Number((amount - tkh).toFixed(0));
      const formatted = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(mablagh);

      const tar1 = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(row.getValue("تعرفه"));
      const met1 = new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
      }).format(row.getValue("متراژ"));

      return (
        <div className="flex flex-col gap-1">
          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="rounded-sm cursor-pointer">
                  {row.getValue("تعرفه شارژ")}
                </p>
              </TooltipTrigger>
              <TooltipContent>{tar1.toPersianDigits()}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="rounded-sm">
                  {<div>{formatted.replace("ریال", "")}</div>}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {tar1.replace("ریال", "") +
                  " * " +
                  met1.replace("ریال", "") +
                  " - " +
                  takhfif +
                  "%"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <Badge className="rounded-sm" variant="secondary">
            {<div>{formatted.replace("ریال", "")}</div>}
          </Badge> */}
          {/* <Badge>{mablagh}</Badge> */}
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعرفه شارژ" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "chargeDef.type",
    id: "نوع تعرفه",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نوع تعرفه" />
    ),
  },
  {
    accessorKey: "chargeDef.charge",
    id: "تعرفه",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تعرفه" />
    ),
  },

  {
    accessorKey: "stores_discounts",
    id: "تخفیف",
    cell: ({ row }) => {
      return (
        <p className="flex flex-col gap-1 ">
          {
            //@ts-ignore
            row.getValue("تخفیف").map((item, i: number) => {
              return (
                <Badge
                  className="p-0 flex flex-row gap-1 justify-around rounded-sm "
                  key={i}
                  variant={"secondary"}
                >
                  {item.discountDef.name}
                  <div className="text-white text-sm px-1 flex flex-row justify-around gap-1 rounded-sm  bg-red-500 w-8">
                    <p className="text-[10px]">{"%"}</p>
                    {String(item.discountDef.discountPersand).toPersianDigits()}
                  </div>
                </Badge>
              );
            })
          }
        </p>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تخفیف" />
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
        <div className="flex flex-col gap-1">
          <Badge className="rounded-sm text-[11px]" variant="secondary">
            {row.getValue("بلوک")}
          </Badge>
          <Badge className="rounded-sm text-[11px]" variant="secondary">
            {row.getValue("تراز")}
          </Badge>
          <Badge
            className="rounded-sm text-[11px] whitespace-nowrap"
            variant="secondary"
          >
            {row.getValue("راهرو")}
          </Badge>
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="موقعیت" />
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
