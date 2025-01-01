"use client";
import { columns } from "@/app/[lang]/(admin)/admin/stores/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import useTwainModal, {
  TwainModal,
} from "@/app/[lang]/components/modals/TwainModal";
import { encodeObjectToHashedQueryString, fetcher } from "@/lib/utils";
import React, { Suspense, useCallback, useState } from "react";
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
  const _TwainModal = useTwainModal();

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
  const { filters: _takh } = useFilter({ filter: "takhfif" }) || undefined;

  // const canAdd = session?.user?.Permission?.find((item) => {
  //   return item.systemID === 1 && item.add === true;
  // });

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 2 && item.edit === true;
  });

  let canAction = { ...per };
  if (permission?.user.role === "admin") {
    canAction = {
      ...per,
      add: true,
      edit: true,
      print: true,
      view: true,
      docedit: true,
      docadd: true,
      docview: true,
    };
  }

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
    `/api/store${searchParams ? `?${searchParams.toString()}` : ""}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  const handleFileClick = (rowData: any, id: any) => {
    const newdata = rowData.Doc_files?.find((doc: any) => doc.id === id) ?? {};
    const myObject = {
      moduleID: newdata.moduleId,
      CatID: newdata.CatID,
      name: newdata.name,
      date_: newdata.date_,
      userID: 1,
      pelak: newdata.pelak,
      rowId: newdata.rowId,
      mode: "edit",
      per: canAction.docedit,
    };

    const hashedQueryString = encodeObjectToHashedQueryString(myObject);
    const filedata = { ...rowData, hash: hashedQueryString };
    console.log(filedata);
    // return;
    setTimeout(() => {
      _TwainModal.onOpen(filedata);
      // resolve("");
    }, 100);
  };
  const handleNewFileClick = (rowData: any, id: any) => {
    const newdata = rowData.list?.find((doc: any) => doc.id === id) ?? {};
    console.log(rowData);
    const myObject = {
      moduleID: newdata.moduleId,
      CatID: newdata.id,
      name: `file_${uuidv4()}.pdf`, // Generate a unique file name with a GUID
      date_: new Date().toISOString(), // Set to the current date and time
      userID: 1,
      pelak: rowData.pelak,
      rowId: rowData.id,
      mode: "add",
      per: canAction.docedit,
    };

    const hashedQueryString = encodeObjectToHashedQueryString(myObject);
    const filedata = { ...rowData, hash: hashedQueryString };
    console.log(filedata);
    console.log(myObject);
    console.log("encode", hashedQueryString);
    console.log(decodeURIComponent(hashedQueryString));

    // return;
    setTimeout(() => {
      _TwainModal.onOpen(filedata);
      // resolve("");
    }, 100);
  };

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
    //console.log(createQueryString("sort", "asc"));
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
    // console.log(rowData);
    // setTimeout(() => {
    //   handlePrint();
    // }, 100);
  };

  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch(
          "/api/store/" + (rowData.pelak !== "" ? rowData.pelak : "1")
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
      <TwainModal mutation={mutate}></TwainModal>
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
        takhfif={_takh}
      ></AddEditStoreModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امکانات / مدیریت شارژ</div>
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
                  current.set("search", encodeURIComponent(String(value)));
                }
                const search = current.toString();
                const query = search ? `?${search}` : "";
                router.push(`${pathname}${query}`);
              }
            }}
            className="placeholder-[#8ba5e2] bordercolor h-8 w-[150px] lg:w-[250px] border px-2 rounded-md my-4"
            placeholder="جستجو در پلاک و نام واحد"
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

          <FacetedFilter
            filterOption="chargeProfile"
            title="تعرفه"
            options={_profile}
            selected={searchParams
              .get("profile")
              ?.toString()
              .split(",")
              .map(Number)}
            onChange={(e) => setQueryString("profile", e)}
          ></FacetedFilter>
        </div>
      </div>

      {canAction.add ? (
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
      )}
      {stores ? (
        stores.length > 0 ? (
          <DataTable
            showPrint={false}
            hiddenCol={{
              تراز: false,
              راهرو: false,
              "نوع تعرفه": false,
              تعرفه: false,
              تلفن: false,
              وضعیت: false,
              تجمیع: false,
            }}
            columns={columns}
            data={stores}
            onPrintClick={handlePrintClick}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            allowEdit={canAction?.edit}
            allowDelete={canAction?.print}
            onChargeClick={handleChargeClick}
            onTenantClick={handleTenantClick}
            onRobClick={handleRobClick}
            onFileClick={handleFileClick}
            onNewFileClick={handleNewFileClick}
            onOwnerClick={handleOwnerClick}
            docadd={canAction?.docadd}
            docedit={canAction?.docedit}
            docview={canAction?.docview}
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
