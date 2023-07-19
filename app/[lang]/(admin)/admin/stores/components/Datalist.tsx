"use client";
import { columns } from "@/app/[lang]/(admin)/admin/stores/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { fetcher, setQueryString } from "@/lib/utils";
import React, { useEffect } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAddUser, {
  AddUser,
} from "@/app/[lang]/components/modals/AddUserModal";

type Props = {};

export default function Datalist({}: Props) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const AddUserModal = useAddUser();
  const AddRecord = () => {
    AddUserModal.onOpen();
  };
  let query;
  if (searchParams) {
    query = searchParams.get("search");
  }
  const {
    data: stores,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(`/api/store?search=${query}`, fetcher);

  return (
    <div>
      <AddUser></AddUser>
      <DebouncedInput
        value={globalFilter ?? ""}
        onChange={(value: string | number) => {
          //console.log(value);
          setGlobalFilter(String(value));
          //?? setQueryString(router, "search", String(value));
          if (searchParams) {
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
        className="p-2 font-lg shadow border border-block"
        placeholder="Search all columns..."
      />
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
