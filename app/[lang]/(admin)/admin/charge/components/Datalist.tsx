"use client";
import { columns } from "@/app/[lang]/(admin)/admin/charge/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import React, { Suspense, useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import useAddEditStoreModal, {
  AddEditStoreModal,
} from "@/app/[lang]/components/modals/AddEditStoreModal";

import useDeleteStoreModal, {
  DeleteStoreModal,
} from "@/app/[lang]/components/modals/DeleteStoreModal";

import useFilter from "@/lib/hooks/useFilter";
import { z } from "zod";
import { Chargechema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle, SlidersHorizontal } from "lucide-react";
import { FcAddRow } from "react-icons/fc";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { FacetedFilter } from "../../stores/components/faceted-filter";
import useAddEditChargeModal, {
  AddEditChargeModal,
} from "@/app/[lang]/components/modals/AddEditChargeModal";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editCharge, seteditCharge] = useState<z.infer<typeof Chargechema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditChargeModal();
  const _DeleteStoreModal = useDeleteStoreModal();
  const { data: session } = useSession();
  // const { filters: _bazar } = useFilter({ filter: "bazar" }) || undefined;
  // const { filters: _tabagh } = useFilter({ filter: "tabagh" }) || undefined;
  // const { filters: _nov } = useFilter({ filter: "nov" }) || undefined;
  // const { filters: _rahro } = useFilter({ filter: "rahro" }) || undefined;

  const canEdit = permission?.user?.Permission?.find((item) => {
    return item.systemID === 1 && item.edit === true;
  });

  const canDelete = permission?.user?.Permission?.find((item) => {
    return item.systemID === 1 && item.print === true;
  });

  const canAdd = permission?.user?.Permission?.find((item) => {
    return item.systemID === 1 && item.add === true;
  });

  const pelak = searchParams.get("pelak")?.toUpperCase();
  const AddRecord = () => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/charge/" + pelak).then(async (res) => {
          if (res.status === 200) {
            const val = await res.json();
            seteditCharge(val);
            setTimeout(() => {
              AddUserModal.onOpen("");
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

    // seteditCharge({
    //   pelak: "",
    //   penalty: 0,
    //   TotalBill: 0,
    //   paidBill: 0,
    //   month: "",
    //   monthbill: 0,
    //   debt: 0,
    //   deptPeriod: 0,
    //   deadline: "",
    //   isueeDate: "",

    //   paidDate: "",
    //   paidExtra: 0,
    //   paidTime: "",
    //   paidType: "",
    //   discount: 0,
    //   discountDiscription: "",
    //   discription: "",
    //   paidExtraAsset: 0,
    // });

    //get lastdore > mounth+1
    //chargeBill>  getActiveProfile> price*metraj
    //debt> getLastDore_TotalBill >
    // 1- if !parkht && paidExtraAsset==0 then debt=getLastDore_TotalBill
    //  else if !pardakht && paidExtraAsset<>0 then  debt= getLastDore_TotalBill-paidExtraAsset and paidExtraAsset=paidExtraAsset-getLastDore_TotalBill

    //jarime> if last_period>4-1 and !pardakht then jarime=LastDore_TotalBill*2%

    //takhfif > userdefined

    //paidExtra > if last paidExtraAsset>0 then
    //if  paidExtraAsset>new_TotalBill > paidExtra=new_TotalBill && paidExtraAsset=paidExtraAsset-new_TotalBill
    //else if paidExtraAsset<new_TotalBill then paidExtra=paidExtraAsset && paidExtraAsset=0

    //if paidbill ==new_TotalBill then period=0
    //if paidBill >new_TotalBill then paidExtraAsset=paidExtraAsset+(paidBill-new_TotalBill)

    //
    // setTimeout(() => {
    //   AddUserModal.onOpen("");
    // }, 100);

    //AddUserModal.onOpen("");
  };

  const {
    data: charges,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(
    `/api/charge${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

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

  const handleDeleteClick = (rowData: { pelak: string; name: string }) => {
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

  const handleActionClick = (rowData: string) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/charge/" + (rowData !== "" ? rowData : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              seteditCharge(val);
              setTimeout(() => {
                AddUserModal.onOpen(rowData);
                resolve("");
              }, 100);
            } else {
              const error = await res.text();
              toast.error(error);
              rejects;
            }
          }
        );
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
      <AddEditChargeModal
        mutation={mutate}
        data={editCharge}
        // nov={_nov}
        // bazar={_bazar}
        // tabagh={_tabagh}
        // rahro={_rahro}
      ></AddEditChargeModal>
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
          placeholder="جستجو در پلاک و نام واحد"
        />
      </div>

      {canAdd ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">ردیف جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {charges ? (
        charges.length > 0 ? (
          <DataTable
            hiddenCol={{
              "بدهی قبلی": false,
              جریمه: false,
              ماه: false,
              "تاریخ پرداخت": false,
              "مهلت پرداخت": false,
              "طلب از قبل": false,
            }}
            columns={columns}
            data={charges}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            allowEdit={canEdit?.edit}
            allowDelete={canDelete?.print}
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
