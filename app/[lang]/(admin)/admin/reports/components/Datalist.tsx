"use client";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { columns } from "@/app/[lang]/(admin)/admin/reports/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/reports/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { Suspense, useCallback, useRef, useState } from "react";
import useSWR from "swr";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { FacetedFilter } from "./faceted-filter";
import useAddEditStoreModal, {
  AddEditStoreModal,
} from "@/app/[lang]/components/modals/AddEditStoreModal";

import useDeleteStoreModal, {
  DeleteStoreModal,
} from "@/app/[lang]/components/modals/DeleteStoreModal";

import useFilter from "@/lib/hooks/useFilter";
import { z } from "zod";
import { StoreSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle, SlidersHorizontal } from "lucide-react";
import { FcAddRow } from "react-icons/fc";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { Badge } from "@/components/ui/badge";
import { PrinterIcon } from "@heroicons/react/24/solid";
import ComponentToPrint from "./groupfish";
import ComponentToPrintfani from "./groupfishfani";

import { useReactToPrint } from "react-to-print";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { AiFillFileExcel } from "react-icons/ai";
import { Input } from "@/components/ui/input";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editstore, setEditstore] = useState<z.infer<typeof StoreSchema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const AddUserModal = useAddEditStoreModal();
  const _DeleteStoreModal = useDeleteStoreModal();
  const { data: session } = useSession();
  const { filters: _bazar } = useFilter({ filter: "bazar" }) || undefined;
  const { filters: _tabagh } = useFilter({ filter: "tabagh" }) || undefined;
  const { filters: _nov } = useFilter({ filter: "nov" }) || undefined;
  const { filters: _rahro } = useFilter({ filter: "rahro" }) || undefined;
  const { filters: _profile } = useFilter({ filter: "profile" }) || undefined;

  // const canAdd = session?.user?.Permission?.find((item) => {
  //   return item.systemID === 1 && item.add === true;
  // });
  const exportToExcel = (apiData: any, fileName: string): void => {
    const worksheet = XLSX.utils.json_to_sheet(apiData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(blob, fileName + ".xlsx");
  };

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 10 && item.edit === true;
  });

  let canAction = { ...per };
  if (permission?.user.role === "admin") {
    canAction = { ...per, add: true, edit: true, print: true, view: true };
  }
  const [printData, setPrintData] = useState<any>([]);
  const [printType, setPrintType] = useState<string>("");

  const AddRecord = () => {
    setEditstore({
      pelakCH: "",
      pelakNU: "",
      nov: "",
      bazar: "",
      tabagh: "",
      rahro: "",
      chargeProfile: "",
      name: "",
      active: false,
      metraj: 0,
      ejareh: 0,
      ChekGift: false,
      ChekRol: "",
      fine3: "",
      tovzeh: "",
      cposti: "",
      Tahvil: "",
      tel1: "",
      tel2: "",
    });

    setTimeout(() => {
      AddUserModal.onOpen("");
    }, 100);

    //AddUserModal.onOpen("");
  };
  const {
    data: stores,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(
    `/api/reports${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  console.log(stores);

  const sumTotalBill1 = stores?.reduce((acc, item) => {
    //@ts-ignore

    return acc + Number(item.TotalBill || 0);
  }, 0);
  //@ts-ignore

  const sumTotalBill = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    //@ts-ignore
  }).format(sumTotalBill1);

  //@ts-ignore
  const sumPaidBill1 = stores?.reduce((acc, item) => {
    return (
      acc +
      //@ts-ignore

      Number(item.paidBill || 0)
      //@ts-ignore

      // Number(item.paidBill1 || 0) +
      // //@ts-ignore

      // Number(item.paidBill2 || 0) +
      // //@ts-ignore

      // Number(item.paidBill3 || 0)
    );
  }, 0);

  const sumPaidBill = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    //@ts-ignore
  }).format(sumPaidBill1);

  const sumDebt1 = stores?.reduce((acc, item) => {
    //@ts-ignore

    return acc + Number(item.debt || 0);
  }, 0);

  const sumDebt = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    //@ts-ignore
  }).format(sumDebt1);

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  const setQueryString = (type: string, e: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.length === 0) {
      current.delete(type);
    } else {
      current.set(type, String(e.join(",")));
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };
  const handleChargeClick = (rowData: any) => {
    // const current = new URLSearchParams();

    // current.set("pelak", String(rowData.pelak));

    // const search = current.toString();
    // const query = search ? `?${search}` : "";
    // //alert(query);
    // router.push({
    //   pathname: "/admin/charge",
    //   query: {
    //     type: "interim",
    //   },
    // });
    // setQueryString("pelak", ["2324-t"]);
    // router.push(`/admin/nov`);
    ////console.log(createQueryString("sort", "asc"));
    router.push(`/admin/charge/${rowData.pelak}`);
    // redirect("/charge/" + rowData.pelak);
  };
  const handleOwnerClick = (rowData: any) => {
    router.push(`/admin/owner/${rowData.pelak}`);
    //redirect("/owner/" + rowData.pelak);
  };
  const handleTenantClick = (rowData: any) => {
    router.push(`/admin/tenant/${rowData.pelak}`);
    //redirect("/tenant/" + rowData.pelak);
  };

  const handleRobClick = (rowData: any) => {
    router.push(`/admin/rob/${rowData.pelak}`);
    //redirect("/tenant/" + rowData.pelak);
  };
  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.pelak);
        setDelLable1(`پلاک : ${rowData.pelak}`);
        setDelLable2(rowData.name);

        setTimeout(() => {
          _DeleteStoreModal.onOpen(rowData.pelak);
          resolve("");
        }, 100);
      });

    toast.promise(promise, {
      loading: "حذف اطلاعات  ...",
      success: (data) => {
        toast.dismiss();
        return `${data} `;
      },
      error: "Error",
    });
  };

  const handlePrintClick = (rowData: any) => {
    // setPrint(rowData);
    // //console.log(rowData);
    // setTimeout(() => {
    //   handlePrint();
    // }, 100);
  };

  const componentRef = useRef(null);
  // const componentRef1 = useRef(null);

  // const handlePrint1 = useReactToPrint({
  //   content: () => componentRef1.current,
  //   documentTitle: "پرینت گزارش",
  // });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "پرینت گزارش",
  });
  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch(
          "/api/reports/" + (rowData.pelak !== "" ? rowData.pelak : "1")
        ).then(async (res) => {
          if (res.status === 200) {
            const val = await res.json();
            setEditstore(val);
            setTimeout(() => {
              AddUserModal.onOpen(rowData.pelak);
              resolve("");
            }, 100);
          } else {
            const error = await res.text();
            toast.error(error);
            rejects;
          }
        });
      });
    toast.promise(promise, {
      loading: "دریافت اطلاعات ...",
      success: (data) => {
        toast.dismiss();
        return `${data} `;
      },
      error: "Error",
    });
  };
  return (
    <div>
      <DeleteStoreModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteStoreModal>
      <AddEditStoreModal
        mutation={mutate}
        data={editstore}
        nov={_nov}
        bazar={_bazar}
        tabagh={_tabagh}
        rahro={_rahro}
        profile={_profile}
      ></AddEditStoreModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امکانات / گزارشات</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) => {
              if (true) {
                const current = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                if (!value) {
                  current.delete("search");
                } else {
                  current.set("search", String(value));
                }
                const search = current.toString();
                const query = search ? `?${search}` : "";
                router.push(`${pathname}${query}`);
              }
            }}
            className="placeholder-[#8ba5e2] bordercolor h-8 w-[150px] lg:w-[250px] border px-2 rounded-md my-4"
            placeholder="  پلاک , نام واحد,مبلغ,شماره فیش"
          />
          <FacetedFilter
            selected={searchParams
              .get("nov")
              ?.toString()
              .split(",")
              .map(Number)}
            filterOption="nov"
            title="نوع"
            options={_nov}
            onChange={(e) => setQueryString("nov", e)}
          ></FacetedFilter>
          <FacetedFilter
            selected={searchParams
              .get("tabagh")
              ?.toString()
              .split(",")
              .map(Number)}
            filterOption="tabagh"
            title="تراز"
            options={_tabagh}
            onChange={(e) => setQueryString("tabagh", e)}
          ></FacetedFilter>
          <FacetedFilter
            selected={searchParams
              .get("bazar")
              ?.toString()
              .split(",")
              .map(Number)}
            filterOption="bazar"
            title="بلوک"
            options={_bazar}
            onChange={(e) => setQueryString("bazar", e)}
          ></FacetedFilter>
          <Suspense fallback="Loading..."></Suspense>
          <FacetedFilter
            filterOption="rahro"
            title="راهرو"
            options={_rahro}
            selected={searchParams
              .get("rahro")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("rahro", e)}
          ></FacetedFilter>

          {/* <FacetedFilter
            filterOption="chargeProfile"
            title="تعرفه"
            options={_profile}
            selected={searchParams
              .get("profile")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("profile", e)}
          ></FacetedFilter> */}

          <FacetedFilter
            filterOption="active"
            title="وضعیت"
            options={[
              { value: "1", label: "فعال" },
              { value: "0", label: "غیر فعال" },
            ]}
            selected={searchParams
              .get("active")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("active", e)}
          ></FacetedFilter>

          <FacetedFilter
            filterOption="date"
            title="دوره"
            options={[
              { value: "1402-05", label: "1402-05" },
              { value: "1402-06", label: "1402-06" },
              { value: "1402-07", label: "1402-07" },
              { value: "1402-08", label: "1402-08" },
              { value: "1402-09", label: "1402-09" },
              { value: "1402-10", label: "1402-10" },
              { value: "1402-11", label: "1402-11" },
              { value: "1402-12", label: "1402-12" },
              { value: "1403-01", label: "1403-01" },
              { value: "1403-02", label: "1403-02" },
              { value: "1403-03", label: "1403-03" },
              { value: "1403-04", label: "1403-04" },
              { value: "1403-05", label: "1403-05" },
              { value: "1403-06", label: "1403-06" },
              { value: "1403-07", label: "1403-07" },
              { value: "1403-08", label: "1403-08" },
              { value: "1403-09", label: "1403-09" },
              { value: "1403-10", label: "1403-10" },
              { value: "1403-11", label: "1403-11" },
              { value: "1403-12", label: "1403-12" },
            ]}
            selected={searchParams
              .get("date")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("date", e)}
          ></FacetedFilter>
          <FacetedFilter
            filterOption="debt"
            title="دوره بدهی"
            options={[
              { value: "1", label: "۱ تا ۵ دوره" },
              { value: "3", label: "۲ تا ۵ دوره" },
              { value: "2", label: "۶ دوره به بالا" },
            ]}
            selected={searchParams
              .get("debt")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("debt", e)}
          ></FacetedFilter>
          <FacetedFilter
            filterOption="pardakht"
            title="وضعیت پرداخت"
            options={[
              { value: "1", label: "پرداخت شده" },
              { value: "2", label: "بدهی دارد" },
            ]}
            selected={searchParams
              .get("pardakht")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("pardakht", e)}
          ></FacetedFilter>

          <FacetedFilter
            filterOption="npardakht"
            title="روش پرداخت"
            options={[
              { value: "1", label: "پوز" },
              { value: "2", label: "پرداخت آنلاین" },
              { value: "3", label: "واریز به حساب" },
              { value: "4", label: "پوز اطلاعات" },
              { value: "5", label: "پوز دفتر مرکزی" },
            ]}
            selected={searchParams
              .get("npardakht")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("npardakht", e)}
          ></FacetedFilter>

          <FacetedFilter
            filterOption="shive"
            title="شیوه پرداخت"
            options={[
              { value: "1", label: "اقساطی" },
              { value: "0", label: "نقدی" },
            ]}
            selected={searchParams
              .get("shive")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("shive", e)}
          ></FacetedFilter>

          <FacetedFilter
            filterOption="tajmi"
            title="تجمیع"
            options={[
              { value: "1", label: "بلی" },
              { value: "0", label: "خیر" },
            ]}
            selected={searchParams
              .get("tajmi")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("tajmi", e)}
          ></FacetedFilter>
        </div>
      </div>

      <div className=" flex flex-row shadow-[#6d93ec]/50 border-0 text-sm mr-28 h-8 gap-2 ">
        <Badge
          className=" shadow-[#6d93ec]/50 border-0 text-sm  h-8  "
          variant={"secondary"}
        >
          تعداد ردیف : {stores?.length}
        </Badge>

        <button onClick={() => exportToExcel(stores, "خروجی اکسل")}>
          <AiFillFileExcel color="green" size={30}></AiFillFileExcel>
        </button>
        <div className=" shadow-[#6d93ec]/50 border-0 text-sm  h-8  ">
          <Button
            className="flex flex-row gap-2 shadow-[#6d93ec]/50 border-0 text-sm  h-8  "
            variant={"secondary"}
            onClick={async () => {
              // startTransition(async () => {
              setPrintData(stores);
              setPrintType("standard");
              setTimeout(() => {
                handlePrint();
              }, 2000);
              // });
            }}
          >
            <PrinterIcon className="w-4 h-4"></PrinterIcon>
            پرینت
          </Button>

          <ComponentToPrint
            data={printData}
            type={printType}
            // chargeDef={printChargeDef}
            // store={printStore}
            ref={componentRef}
          />
        </div>

        <div className=" shadow-[#6d93ec]/50 border-0 text-sm  h-8  ">
          <Button
            className="flex flex-row gap-2 shadow-[#6d93ec]/50 border-0 text-sm  h-8  "
            variant={"secondary"}
            onClick={async () => {
              // startTransition(async () => {
              setPrintData(stores);
              setPrintType("fani");

              setTimeout(() => {
                handlePrint();
              }, 2000);
              // });
            }}
          >
            <PrinterIcon className="w-4 h-4"></PrinterIcon>
            پرینت برای بخش فنی
          </Button>

          {/* <ComponentToPrint
            data={printData}
            type="fani"
            // chargeDef={printChargeDef}
            // store={printStore}
            ref={componentRef}
          /> */}
        </div>
        <div className=" shadow-[#6d93ec]/50 border-0 text-sm  h-8  ">
          <Select
            defaultValue="p"
            onValueChange={(e: string) => setQueryString("sort", [e])}
          >
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>مرتب سازی بر اساس</SelectLabel>
                <SelectItem value="p">پلاک</SelectItem>
                <SelectItem value="r">تصادفی</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <DatePicker
            placeholder="پرداخت از تاریخ"
            onChange={(date) => {
              // field.onChange(date ? date.toString() : "");
              setQueryString(
                "fromdate",
                date ? [date.toString().toEnglishDigits()] : []
              );
            }}
            style={{
              width: "50px !important",

              height: "30px",
              borderRadius: "8px",
              fontSize: "14px",
              padding: "3px 10px !important",
            }}
            format={"YYYY/MM/DD"}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-center"
          />
        </div>
        <div>
          <DatePicker
            placeholder="پرداخت تا تاریخ"
            onChange={(date) => {
              setQueryString(
                "todate",
                date ? [date.toString().toEnglishDigits()] : []
              );
            }}
            style={{
              width: "50px !important",

              height: "30px",
              borderRadius: "8px",
              fontSize: "14px",
              padding: "3px 10px !important",
            }}
            format={"YYYY/MM/DD"}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-center"
          />
        </div>
      </div>

      <div className="w-full flex justify-end m-2 gap-2">
        <Badge
          className=" shadow-[#6d93ec]/50 border-0 text-[12px]  h-8  "
          variant={"secondary"}
        >
          قابل پرداخت : {sumTotalBill}
        </Badge>

        <Badge
          className=" shadow-[#6d93ec]/50 border-0 text-[12px]  h-8  "
          variant={"secondary"}
        >
          پرداخت شده : {sumPaidBill}
        </Badge>

        <Badge
          className=" shadow-[#6d93ec]/50 border-0 text-[12px]  h-8  "
          variant={"secondary"}
        >
          بدهی : {sumDebt}
        </Badge>
      </div>
      {/* {canAction.add ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">واحد جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )} */}

      {stores ? (
        stores.length > 0 ? (
          <DataTable
            showPrint={false}
            hiddenCol={{
              تراز: false,
              راهرو: false,
              "نوع تعرفه": false,
              "تاریخ پرداخت ۲": false,
              تعرفه: false,
              تلفن: false,
              واریز۱: false,
              واریز۲: false,
              واریز۳: false,
              نحوه: false,
              تجمیع: false,
              رهگیری: false,
            }}
            columns={columns}
            data={stores}
            onPrintClick={handlePrintClick}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            allowEdit={false}
            allowDelete={false}
            onChargeClick={handleChargeClick}
            onTenantClick={handleTenantClick}
            onRobClick={handleRobClick}
            onOwnerClick={handleOwnerClick}
          ></DataTable>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-sm text-gray-500">ردیفی پیدا نشد</p>
          </div>
        )
      ) : (
        Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
      )}
    </div>
  );
}

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-1 py-3 sm:px-0">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex flex-col">
        {/* <div className="h-4 w-24 animate-pulse rounded bg-gray-200" /> */}
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex flex-col">
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      className=""
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
