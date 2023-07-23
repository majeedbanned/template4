"use client";
import { columns } from "@/app/[lang]/(admin)/admin/stores/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import React, { Suspense, use, useCallback, useEffect } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FacetedFilter } from "./faceted-filter";
import { statuses } from "../data/data";
import useAddEditStoreModal, {
  AddEditStoreModal,
} from "@/app/[lang]/components/modals/AddEditStoreModal";

type Props = {};

export default function Datalist({}: Props) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditStoreModal();
  const AddRecord = () => {
    AddUserModal.onOpen("add");
  };
  let query;
  let rahro;
  if (searchParams) {
    query = searchParams.get("search");
    rahro = searchParams.get("rahro");
  }
  const {
    data: stores,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(
    // `/api/store?key=1${query ? "&search=" + query : ""}`,
    `/api/store${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher
  );

  // const createQueryString = (name: string, value: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set(name, value);

  //   return params.toString();
  // };

  // const deleteQueryString = (name: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.delete(name);
  //   return params.toString();
  // };
  const setQueryString = (type: string, e: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.length === 0) {
      current.delete(type);
    } else {
      current.set(type, String(e.join(",")));
    }
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleActionClick = (rowData: string) => {
    AddUserModal.onOpen(rowData);
    console.log("Action clicked for row:", rowData);
    // Add your action logic here
  };
  return (
    <div>
      <AddEditStoreModal></AddEditStoreModal>
      <DebouncedInput
        value={globalFilter ?? ""}
        onChange={(value: string | number) => {
          //console.log(value);
          // setGlobalFilter(String(value));
          console.log("start>>", value);
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
            // or const query = `${'?'.repeat(search.length && 1)}${search}`;
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
        options={statuses}
        onChange={(e) => setQueryString("tabagh", e)}
      ></FacetedFilter>
      <FacetedFilter
        selected={searchParams.get("bazar")?.toString().split(",").map(Number)}
        filterOption="bazar"
        title="bazar"
        options={statuses}
        onChange={(e) => setQueryString("bazar", e)}
      ></FacetedFilter>
      <Suspense fallback="Loading...">
        <FacetedFilter
          selected={searchParams.get("nov")?.toString().split(",").map(Number)}
          filterOption="nov"
          title="nov"
          options={statuses}
          onChange={(e) => setQueryString("nov", e)}
        ></FacetedFilter>
      </Suspense>
      <FacetedFilter
        filterOption="rahro"
        title="rahro"
        options={statuses}
        selected={searchParams.get("rahro")?.toString().split(",").map(Number)}
        onChange={(e) => setQueryString("rahro", e)}
      ></FacetedFilter>

      <Button onClick={() => mutate()}>mutate</Button>
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
