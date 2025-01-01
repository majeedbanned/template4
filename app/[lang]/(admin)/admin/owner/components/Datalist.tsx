"use client";
import { columns } from "@/app/[lang]/(admin)/admin/owner/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { encodeObjectToHashedQueryString, fetcher } from "@/lib/utils";
import React, { useState } from "react";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useAddEditOwnerModal from "@/app/[lang]/components/modals/AddEditOwnerModal";
import useDeleteOwnerModal from "@/app/[lang]/components/modals/DeleteOwnerModal";
import { z } from "zod";
import { Ownerschema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { AddEditOwnerModal } from "@/app/[lang]/components/modals/AddEditOwnerModal";
import { DeleteOwnerModal } from "@/app/[lang]/components/modals/DeleteOwnerModal";
import useTwainModal, {
  TwainModal,
} from "@/app/[lang]/components/modals/TwainModal";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editowner, setEditowner] = useState<z.infer<typeof Ownerschema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditOwnerModal();
  const _DeleteOwnerModal = useDeleteOwnerModal();
  const _TwainModal = useTwainModal();

  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 4 && item.edit === true;
  });
  let canAction = { ...per };
  // //console.log("canAction", canAction);

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

  //const pelak = searchParams.get("pelak")?.toUpperCase();
  const pelak = useParams();
  // //console.log(pelak?.pelak);
  const AddRecord = () => {
    setEditowner({
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

  //${searchParams ? `?${searchParams.toString()}
  const {
    data: owner,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Ownerschema>[]>(
    `/api/owner?pelak=${pelak ? `${pelak?.pelak.toString()}` : ""}${
      searchParams ? `&${searchParams}` : ``
    } `,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  ////console.log(owner);
  // ${
  //   searchParams ? `&search=${searchParams}` : ``
  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.trow);
        setDelLable1(`پلاک : ${rowData.pelak}`);
        setDelLable2(rowData.tlname + " " + rowData.tfname);
        setTimeout(() => {
          _DeleteOwnerModal.onOpen(rowData.trow);
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

  const handleNewFileClick = (rowData: any, id: any) => {
    const newdata = rowData.list?.find((doc: any) => doc.id === id) ?? {};
    //console.log(rowData);
    const myObject = {
      moduleID: newdata.moduleId,
      CatID: newdata.id,
      name: `file_${uuidv4()}.pdf`, // Generate a unique file name with a GUID
      date_: new Date().toISOString(), // Set to the current date and time
      userID: 1,
      pelak: rowData.pelak,
      rowId: rowData.trow,
      mode: "add",
      per: canAction.docedit,
    };

    const hashedQueryString = encodeObjectToHashedQueryString(myObject);
    const filedata = { ...rowData, hash: hashedQueryString };
    //console.log(filedata);
    //console.log(myObject);
    //console.log("encode", hashedQueryString);
    //console.log(decodeURIComponent(hashedQueryString));

    // return;
    setTimeout(() => {
      _TwainModal.onOpen(filedata);
      // resolve("");
    }, 100);
  };

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
    //console.log(filedata);
    // return;
    setTimeout(() => {
      _TwainModal.onOpen(filedata);
      // resolve("");
    }, 100);
  };
  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/owner/" + (rowData.trow !== "" ? rowData.trow : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              setEditowner(val);
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

  ////console.log(owner);
  return (
    <div>
      <TwainModal mutation={mutate}></TwainModal>
      <DeleteOwnerModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteOwnerModal>
      <AddEditOwnerModal mutation={mutate} data={editowner}></AddEditOwnerModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امکانات / مالکین</div>
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
            className="placeholder-[#8ba5e2] bordercolor h-8 w-[350px] lg:w-[350px] border px-2 rounded-md my-4"
            placeholder="جستجو در نام , فامیل , پلاک , موبایل , کد ملی , تاریخ انتقال  "
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
          <span className="text-white">مالک جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {owner ? (
        owner.length > 0 ? (
          <DataTable
            showPrint={false}
            hiddenCol={{}}
            columns={columns}
            data={owner}
            onPrintClick={handlePrintClick}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            onFileClick={handleFileClick}
            onNewFileClick={handleNewFileClick}
            allowEdit={canAction?.edit}
            allowDelete={canAction?.print}
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
