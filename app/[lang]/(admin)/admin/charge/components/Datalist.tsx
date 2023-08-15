"use client";
import { columns } from "@/app/[lang]/(admin)/admin/charge/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useDeleteChargeModal, {
  DeleteChargeModal,
} from "@/app/[lang]/components/modals/DeleteChargeModal";
import { z } from "zod";
import { Chargechema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import useAddEditChargeModal, {
  AddEditChargeModal,
} from "@/app/[lang]/components/modals/AddEditChargeModal";
import ComponentToPrint from "@/app/[lang]/components/prints/fish";
import { useReactToPrint } from "react-to-print";
import { redirect } from "next/navigation";

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const pelak = useParams();

  const [editCharge, seteditCharge] = useState<z.infer<typeof Chargechema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<any>();
  const [print, setPrint] = useState<any>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditChargeModal();
  const _DeleteChargeModal = useDeleteChargeModal();

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 1 && item.edit === true;
  });

  let canAction = { ...per };
  if (permission?.user.role === "admin") {
    canAction = { ...per, add: true, edit: true, print: true, view: true };
  }

  // const pelak = searchParams.get("pelak")?.toUpperCase();

  // if (!pelak) router.push("admin/main");
  const AddRecord = () => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/charge/" + pelak?.pelak).then(async (res) => {
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
  };

  const {
    data: charges,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(
    `/api/charge?pelak=${pelak ? `${pelak?.pelak.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AwesomeFileName",
  });

  const handlePrintClick = (rowData: any) => {
    setPrint(rowData);
    console.log(rowData);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleDeleteClick = (rowData: any) => {
    console.log(rowData);
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.id);
        setDelLable1(rowData);
        setTimeout(() => {
          _DeleteChargeModal.onOpen(rowData.id);
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

  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch(
          "/api/charge/edit/" + (rowData.id !== "" ? rowData.id : "1")
        ).then(async (res) => {
          if (res.status === 200) {
            const val = await res.json();
            seteditCharge(val);
            setTimeout(() => {
              AddUserModal.onOpen(rowData.id);
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
      <DeleteChargeModal
        mutation={mutate}
        data={deleteID}
        row={delLable1}
      ></DeleteChargeModal>
      <AddEditChargeModal
        mutation={mutate}
        data={editCharge}
      ></AddEditChargeModal>
      <div className="flex flex-col p-2 py-4 text-blue-400 text-sm">
        <div>
          <div> امکانات / لیست شارژ</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap"></div>
      </div>
      <ComponentToPrint data={print} ref={componentRef} />

      {canAction.add ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">ردیف جدید</span>
        </Button>
      ) : (
        // <button className="button">Button</button>
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
              "بستانکاراز قبل": false,
              کد: false,
              "اضافه پرداخت": false,
            }}
            columns={columns}
            data={charges}
            showPrint={true}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            onPrintClick={handlePrintClick}
            allowEdit={canAction?.edit}
            allowDelete={canAction?.print}
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
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex flex-col">
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
