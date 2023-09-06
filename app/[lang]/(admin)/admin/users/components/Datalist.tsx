"use client";
import { columns } from "@/app/[lang]/(admin)/admin/users/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import React, { useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAddEditUserModal, {
  AddEditUserModal,
} from "@/app/[lang]/components/modals/AddEditUserModal";
import useDeleteUserModal, {
  DeleteUserModal,
} from "@/app/[lang]/components/modals/DeleteUserModal";
import { z } from "zod";
import { Userschema } from "@/lib/schemas";
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
  const [edituser, setEdituser] = useState<z.infer<typeof Userschema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditUserModal();
  const _DeleteuserModal = useDeleteUserModal();

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 6 && item.edit === true;
  });

  let canAction = { ...per };
  if (permission?.user.role === "admin") {
    canAction = { ...per, add: true, edit: true, print: true, view: true };
  }

  const pelak = searchParams.get("pelak")?.toUpperCase();

  const AddRecord = () => {
    setEdituser({
      id: 0,
      name: "",
      lname: "",
      username: "",
      password: "",
      role: "",
      active: true,
    });

    setTimeout(() => {
      AddUserModal.onOpen("");
    }, 100);
  };
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Userschema>[]>(
    `/api/users${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.id);
        setDelLable1(`نام کاربری : ${rowData.username}`);
        setDelLable2(rowData.name + " " + rowData.lname);
        setTimeout(() => {
          _DeleteuserModal.onOpen(rowData.id);
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
        fetch("/api/users/" + (rowData.id !== "" ? rowData.id : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              // console.log("valval>", val);
              setEdituser(val);
              setTimeout(() => {
                AddUserModal.onOpen(rowData.id);
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
      <DeleteUserModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteUserModal>
      <AddEditUserModal mutation={mutate} data={edituser}></AddEditUserModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امنیت / تعریف کاربران</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap"></div>
      </div>
      {canAction?.add ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">کاربر جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {user ? (
        user.length > 0 ? (
          <DataTable
            hiddenCol={{}}
            showPrint={false}
            columns={columns}
            data={user}
            onPrintClick={handlePrintClick}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
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
