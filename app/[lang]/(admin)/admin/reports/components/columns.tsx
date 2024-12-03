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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
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
    accessorKey: "nov",
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
        <div className="text-slate-600 text-[12px] font-medium">
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
    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium text-sm">
          {String(row.getValue("متراژ")).toPersianDigits()}
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="متراژ" />
    ),
  },
  // {
  //   accessorKey: "tel1",
  //   id: "تلفن",

  //   header: ({ column }) => {
  //     return <div className="flex m-0 px-0  font-semibold">تلفن</div>;
  //   },
  // },

  {
    accessorKey: "active",
    id: "وضعیت",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="وضعیت" />;
    },

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          <div>
            {
              //@ts-ignore

              //@ts-ignore
              row.getValue("وضعیت").toString() === "true" ? "فعال" : "غیر فعال"
            }
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "month",
    id: "دوره",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="دوره" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          <div className="text-[11px]">
            {
              //@ts-ignore

              //@ts-ignore
              row.getValue("دوره")
            }
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "debt",
    id: "بدهی",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="بدهی" />;
    },

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {
            //@ts-ignore
            row.getValue("بدهی") ? (
              <Badge
                className="rounded-lg w-fit bordercolor text-sm  border-0 text-[#000] text-[12px] "
                variant="outline"
              >
                {
                  //@ts-ignore
                  new Intl.NumberFormat("fa-IR", {
                    style: "currency",
                    currency: "IRR",
                  })
                    .format(
                      //@ts-ignore
                      row.getValue("بدهی")
                    )
                    .replace("ریال", "")
                }
              </Badge>
            ) : (
              <p></p>
            )
          }
        </div>
      );
    },
  },
  {
    accessorKey: "penalty",
    id: "جریمه",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="جریمه" />;
    },

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {
            //@ts-ignore
            row.getValue("جریمه") ? (
              <Badge
                className="rounded-lg w-fit bordercolor text-sm  border-0 text-[#000] text-[12px] "
                variant="outline"
              >
                {
                  //@ts-ignore
                  new Intl.NumberFormat("fa-IR", {
                    style: "currency",
                    currency: "IRR",
                  })
                    .format(
                      //@ts-ignore
                      row.getValue("جریمه")
                    )
                    .replace("ریال", "")
                }
              </Badge>
            ) : (
              <p></p>
            )
          }
        </div>
      );
    },
  },
  {
    accessorKey: "TotalBill",
    id: "شارژ",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="قابل پرداخت" />;
    },

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {
            //@ts-ignore
            row.getValue("شارژ") ? (
              <Badge
                className="rounded-lg w-fit bordercolor text-sm bg-[#6cd46c] border-0 text-[#ffffff] font-bold"
                variant="outline"
              >
                {
                  //@ts-ignore
                  new Intl.NumberFormat("fa-IR", {
                    style: "currency",
                    currency: "IRR",
                  })
                    .format(
                      //@ts-ignore
                      row.getValue("شارژ")
                    )
                    .replace("ریال", "")
                }
              </Badge>
            ) : (
              <p></p>
            )
          }
        </div>
      );
    },
  },

  {
    accessorKey: "paidBill1",
    id: "واریز۱",
  },
  {
    accessorKey: "paidDate1",
    id: "تاریخ پرداخت ۲",
  },
  {
    accessorKey: "paidBill2",
    id: "واریز۲",
  },
  {
    accessorKey: "paidBill3",
    id: "واریز۳",
  },
  {
    accessorKey: "rrn",
    id: "رهگیری",
  },

  {
    accessorKey: "paidBill",
    id: "حساب",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="پرداخت شده" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {
            //@ts-ignore
            row.getValue("حساب") ? (
              <>
                <Badge
                  className="rounded-lg w-fit bordercolor text-sm bg-white  border-[#6cd46c] border text-slate-600 font-bold"
                  variant="outline"
                >
                  {
                    //@ts-ignore

                    new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(
                        //@ts-ignore
                        row.getValue("حساب")
                      )
                      .replace("ریال", "")
                  }
                </Badge>
                <p className="text-[10px] p-2">{row.getValue("رهگیری")}</p>
                <p>
                  {row.getValue("واریز۱") != 0 &&
                    new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(
                        //@ts-ignore
                        row.getValue("واریز۱")
                      )
                      .replace("ریال", "")}
                </p>
                <p>
                  {row.getValue("واریز۲") != 0 &&
                    new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(
                        //@ts-ignore
                        row.getValue("واریز۲")
                      )
                      .replace("ریال", "")}
                </p>

                <p>
                  {row.getValue("واریز۳") != 0 &&
                    new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(
                        //@ts-ignore
                        row.getValue("واریز۳")
                      )
                      .replace("ریال", "")}
                </p>
              </>
            ) : (
              <p></p>
            )
          }
        </div>
      );
    },
  },
  {
    accessorKey: "paidDate",
    id: "تاریخ پرداخت",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="text-slate-600 text-[12px] font-medium">
            {String(row.getValue("تاریخ پرداخت")).toPersianDigits()}
          </div>
          <div className="text-slate-600 text-[12px] font-medium">
            {String(row.getValue("تاریخ پرداخت ۲")).toPersianDigits()}
          </div>
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ پرداخت" />
    ),
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
    accessorKey: "deptPeriod",
    id: "دوره بدهی",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="دوره بدهی" />;
    },

    cell: ({ row }) => {
      return (
        <div className="text-slate-600 font-medium">
          {
            //@ts-ignore
            row.getValue("دوره بدهی") ? (
              <div>
                {
                  //@ts-ignore

                  new Intl.NumberFormat("fa-IR", {
                    style: "currency",
                    currency: "IRR",
                  })
                    .format(
                      //@ts-ignore
                      row.getValue("دوره بدهی")
                    )
                    .replace("ریال", "")
                }
              </div>
            ) : (
              <p></p>
            )
          }
        </div>
      );
    },
  },

  {
    accessorKey: "discription",
    id: "توضیحات",

    cell: ({ row }) => {
      return (
        <div>
          <div className="flex flex-col gap-1">
            <div className="text-white text-[12px] rounded-md flex justify-center items-center font-medium bg-yellow-500">
              {row.getValue("نحوه")?.toString() === "true" ? " اقساطی" : ""}
            </div>
            <div className="text-white text-[12px] rounded-md flex justify-center items-center font-medium bg-green-500">
              {row.getValue("تجمیع")?.toString() === "true" ? " تجمیع" : ""}
            </div>
          </div>
          {String(row.getValue("توضیحات")).trim() !== "null" &&
          String(row.getValue("توضیحات")).trim() !== "" ? (
            <HoverCard openDelay={200}>
              <HoverCardTrigger>
                <InformationCircleIcon className="text-red-500 w-6 h-6 cursor-pointer"></InformationCircleIcon>
              </HoverCardTrigger>
              <HoverCardContent>
                {String(row.getValue("توضیحات"))}
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div></div>
          )}
        </div>
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="توضیحات" />;
    },
  },

  // {
  //   accessorKey: "ejareh",
  //   id: "تعرفه ثابت",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("تعرفه ثابت"));
  //     const formatted = new Intl.NumberFormat("fa-IR", {
  //       style: "currency",
  //       currency: "IRR",
  //     }).format(amount);

  //     return (
  //       <Badge variant={"outline"} className="rounded-sm text-sm text-blue-400">
  //         {formatted.replace("ریال", "")}
  //       </Badge>
  //     );
  //   },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="تعرفه ثابت" />
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },

  // {
  //   accessorKey: "chargeDef.name",
  //   id: "تعرفه شارژ",
  //   cell: ({ row }) => {
  //     const ttype = row.getValue("نوع تعرفه");
  //     let amount = 0;
  //     if (ttype == "2") amount = row.getValue("تعرفه");
  //     else
  //       amount =
  //         parseFloat(row.getValue("تعرفه")) * parseFloat(row.getValue("متراژ"));

  //     let takhfif = 0;
  //     // takhfif += row.getValue("تخفیف").map((item, i: number) => {
  //     //   return item.discountPersand;
  //     // });
  //     //@ts-ignore

  //     takhfif = row.getValue("تخفیف").reduce(function (s, a) {
  //       return s + parseFloat(a.discountDef.discountPersand);
  //     }, 0);

  //     const tkh = (takhfif / 100) * Number(amount.toFixed(0));
  //     const mablagh = Number((amount - tkh).toFixed(0));
  //     const formatted = new Intl.NumberFormat("fa-IR", {
  //       style: "currency",
  //       currency: "IRR",
  //     }).format(mablagh);

  //     const tar1 = new Intl.NumberFormat("fa-IR", {
  //       style: "currency",
  //       currency: "IRR",
  //     }).format(row.getValue("تعرفه"));
  //     const met1 = new Intl.NumberFormat("fa-IR", {
  //       style: "currency",
  //       currency: "IRR",
  //     }).format(row.getValue("متراژ"));

  //     return (
  //       <div className="flex flex-col gap-1">
  //         <TooltipProvider delayDuration={400}>
  //           <Tooltip>
  //             <TooltipTrigger asChild>
  //               <p className="rounded-sm cursor-pointer">
  //                 {row.getValue("تعرفه شارژ")}
  //               </p>
  //             </TooltipTrigger>
  //             <TooltipContent>{tar1.toPersianDigits()}</TooltipContent>
  //           </Tooltip>
  //         </TooltipProvider>

  //         <TooltipProvider delayDuration={400}>
  //           <Tooltip>
  //             <TooltipTrigger asChild>
  //               <p className="rounded-sm">
  //                 {<div>{formatted.replace("ریال", "")}</div>}
  //               </p>
  //             </TooltipTrigger>
  //             <TooltipContent>
  //               {tar1.replace("ریال", "") +
  //                 " * " +
  //                 met1.replace("ریال", "") +
  //                 " - " +
  //                 takhfif +
  //                 "%"}
  //             </TooltipContent>
  //           </Tooltip>
  //         </TooltipProvider>

  //         {/* <Badge className="rounded-sm" variant="secondary">
  //           {<div>{formatted.replace("ریال", "")}</div>}
  //         </Badge> */}
  //         {/* <Badge>{mablagh}</Badge> */}
  //       </div>
  //     );
  //   },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="تعرفه شارژ" />
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },

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

  // {
  //   accessorKey: "stores_discounts",
  //   id: "تخفیف",
  //   cell: ({ row }) => {
  //     return (
  //       <p className="flex flex-col gap-1 ">
  //         {
  //           //@ts-ignore
  //           row.getValue("تخفیف").map((item, i: number) => {
  //             return (
  //               <Badge
  //                 className="p-0 flex flex-row gap-1 justify-around rounded-sm "
  //                 key={i}
  //                 variant={"secondary"}
  //               >
  //                 {item.discountDef.name}
  //                 <div className="text-white text-sm px-1 flex flex-row justify-around gap-1 rounded-sm  bg-red-500 w-8">
  //                   <p className="text-[10px]">{"%"}</p>
  //                   {String(item.discountDef.discountPersand).toPersianDigits()}
  //                 </div>
  //               </Badge>
  //             );
  //           })
  //         }
  //       </p>
  //     );
  //   },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="تخفیف" />
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },

  {
    accessorKey: "bazar",
    id: "بلوک",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col ">
          <p className="whitespace-nowrap text-[11px]">
            {row.getValue("بلوک")}
          </p>

          <p className="whitespace-nowrap text-[11px]">
            {row.getValue("تراز")}
          </p>

          <p className=" whitespace-nowrap text-[11px]">
            {row.getValue("راهرو")}
          </p>
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
    accessorKey: "tabagh",
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
    accessorKey: "rahro",
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
