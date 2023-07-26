"use client";
import { columns } from "@/app/[lang]/(admin)/admin/stores/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import React, { Suspense, useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

type Props = {};

export default function Datalist({}: Props) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editstore, setEditstore] = useState<z.infer<typeof StoreSchema>>();
  const [deleteID, setDeleteID] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditStoreModal();
  const _DeleteStoreModal = useDeleteStoreModal();

  const { filters: _bazar } = useFilter({ filter: "bazar" }) || undefined;
  const { filters: _tabagh } = useFilter({ filter: "tabagh" }) || undefined;
  const { filters: _nov } = useFilter({ filter: "nov" }) || undefined;
  const { filters: _rahro } = useFilter({ filter: "rahro" }) || undefined;

  const AddRecord = () => {
    setEditstore({
      pelakCH: "",
      pelakNU: "",
      nov: "",
      bazar: "",
      tabagh: "",
      rahro: "",
      name: "",
      active: false,
      metraj: 0,
      ChekGift: false,
      ChekRol: "",
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
    `/api/store${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      revalidateOnMount: true,
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

  const handleDeleteClick = (rowData: string) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData);
        setTimeout(() => {
          _DeleteStoreModal.onOpen(rowData);
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
        fetch("/api/store/" + (rowData !== "" ? rowData : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              setEditstore(val);
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
      <DeleteStoreModal mutation={mutate} data={deleteID}></DeleteStoreModal>
      <AddEditStoreModal
        mutation={mutate}
        data={editstore}
        nov={_nov}
        bazar={_bazar}
        tabagh={_tabagh}
        rahro={_rahro}
      ></AddEditStoreModal>
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
        className="h-8 w-[150px] lg:w-[250px] border px-2 rounded-md mx-2"
        placeholder="Search all columns..."
      />
      <FacetedFilter
        selected={searchParams.get("tabagh")?.toString().split(",").map(Number)}
        filterOption="tabagh"
        title="tabagh"
        options={_tabagh}
        onChange={(e) => setQueryString("tabagh", e)}
      ></FacetedFilter>
      <FacetedFilter
        selected={searchParams.get("bazar")?.toString().split(",").map(Number)}
        filterOption="bazar"
        title="bazar"
        options={_bazar}
        onChange={(e) => setQueryString("bazar", e)}
      ></FacetedFilter>
      <Suspense fallback="Loading...">
        <FacetedFilter
          selected={searchParams.get("nov")?.toString().split(",").map(Number)}
          filterOption="nov"
          title="nov"
          options={_nov}
          onChange={(e) => setQueryString("nov", e)}
        ></FacetedFilter>
      </Suspense>
      <FacetedFilter
        filterOption="rahro"
        title="rahro"
        options={_rahro}
        selected={searchParams.get("rahro")?.toString().split(",").map(Number)}
        onChange={(e) => setQueryString("rahro", e)}
      ></FacetedFilter>
      <Button onClick={AddRecord} variant={"outline"}>
        Add
      </Button>
      <div className="grid divide-y divide-gray-200">
        {stores ? (
          stores.length > 0 ? (
            <DataTable
              columns={columns}
              data={stores}
              isLoading={isLoading}
              onActionClick={handleActionClick}
              onDeleteClick={handleDeleteClick}
            ></DataTable>
          ) : (
            // users.map((user) => (
            //  <UserCard key={user.email} user={user} currentTab={currentTab} />
            //   <div key={user.id.toString()}>{user.mahd_name}</div>
            // ))
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm text-gray-500">No invitations sent</p>
            </div>
          )
        ) : (
          Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
        )}
      </div>
    </div>
  );
}

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
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
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
