"use client";
import { columns } from "@/app/[lang]/(admin)/admin/tenant/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import React, { useState } from "react";
import useSWR from "swr";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useAddEditTenantModal from "@/app/[lang]/components/modals/AddEditTenantModal";
import useDeleteTenantModal from "@/app/[lang]/components/modals/DeleteTenantModal";
import { z } from "zod";
import { Tenantschema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { AddEditTenantModal } from "@/app/[lang]/components/modals/AddEditTenantModal";
import { DeleteTenantModal } from "@/app/[lang]/components/modals/DeleteTenantModal";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [edittenant, setEdittenant] = useState<z.infer<typeof Tenantschema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditTenantModal();
  const _DeleteTenantModal = useDeleteTenantModal();

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 3 && item.edit === true;
  });

  let canAction = { ...per };
  if (permission?.user.role === "admin") {
    canAction = { ...per, add: true, edit: true, print: true, view: true };
  }

  // const pelak = searchParams.get("pelak")?.toUpperCase();
  const pelak = useParams();
  const AddRecord = () => {
    setEdittenant({
      taddress: "",
      tfather: "",
      tfname: "",
      tjob: "",
      tlname: "",
      tmeli: "",
      tmobile: "",
      ttel: "",
      sex: "",
      cposti: "",
      pelak: pelak ? pelak?.pelak.toString() : "",
      trow: 0,
    });

    setTimeout(() => {
      AddUserModal.onOpen("");
    }, 100);
  };
  const {
    data: tenant,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Tenantschema>[]>(
    `/api/tenant?pelak=${pelak ? `${pelak?.pelak.toString()}` : ""}${
      searchParams ? `&${searchParams}` : ``
    } `,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.trow);
        setDelLable1(`پلاک : ${rowData.pelak}`);
        setDelLable2(rowData.tlname + " " + rowData.tfname);
        setTimeout(() => {
          _DeleteTenantModal.onOpen(rowData.trow);
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
        fetch("/api/tenant/" + (rowData.trow !== "" ? rowData.trow : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              setEdittenant(val);
              setTimeout(() => {
                AddUserModal.onOpen(rowData.trow);
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
      <DeleteTenantModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteTenantModal>
      <AddEditTenantModal
        mutation={mutate}
        data={edittenant}
      ></AddEditTenantModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امکانات / تعریف مستاجرین</div>
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
            placeholder="جستجو در نام و فامیل و پلاک  "
          />
        </div>
      </div>
      {canAction.add && pelak?.pelak != "all" ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">مستاجر جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {tenant ? (
        tenant.length > 0 ? (
          <DataTable
            hiddenCol={{}}
            columns={columns}
            data={tenant}
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
