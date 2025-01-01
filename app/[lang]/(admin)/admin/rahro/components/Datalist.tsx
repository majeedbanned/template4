"use client";
import { columns } from "@/app/[lang]/(admin)/admin/rahro/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import React, { useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAddEditRahroModal, {
  AddEditRahroModal,
} from "@/app/[lang]/components/modals/AddEditRahroModal";
import useDeleteRahroModal, {
  DeleteRahroModal,
} from "@/app/[lang]/components/modals/DeleteRahroModal";
import { z } from "zod";
import { Rahroschema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editrahro, setEditrahro] = useState<z.infer<typeof Rahroschema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddRahroModal = useAddEditRahroModal();
  const _DeleterahroModal = useDeleteRahroModal();

  const pelak = searchParams.get("pelak")?.toUpperCase();

  const AddRecord = () => {
    setEditrahro({
      id: 0,
      rahro: "",
    });

    setTimeout(() => {
      AddRahroModal.onOpen("");
    }, 100);
  };
  const {
    data: rahro,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Rahroschema>[]>(
    `/api/rahro${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.id);
        setDelLable1(`عنوان  : ${rowData.rahro}`);
        setDelLable2(rowData.id);
        setTimeout(() => {
          _DeleterahroModal.onOpen(rowData.id);
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

  const handlePrintClick = (rowData: any) => {};

  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/rahro/" + (rowData.id !== "" ? rowData.id : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              // //console.log("valval>", val);
              setEditrahro(val);
              setTimeout(() => {
                AddRahroModal.onOpen(rowData.id);
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
      <DeleteRahroModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteRahroModal>
      <AddEditRahroModal mutation={mutate} data={editrahro}></AddEditRahroModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> اطلاعات پایه / تعریف راهرو</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap"></div>
      </div>
      {true ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">راهرو جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {rahro ? (
        rahro.length > 0 ? (
          <DataTable
            hiddenCol={{}}
            showPrint={false}
            columns={columns}
            data={rahro}
            onPrintClick={handlePrintClick}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            allowEdit={true}
            allowDelete={true}
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
