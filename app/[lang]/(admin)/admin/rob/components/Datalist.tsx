"use client";
import { columns } from "@/app/[lang]/(admin)/admin/rob/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useReactToPrint } from "react-to-print";
// import moment from "moment-jalaali";
import useTwainModal, {
  TwainModal,
} from "@/app/[lang]/components/modals/TwainModal";
import { encodeObjectToHashedQueryString, fetcher } from "@/lib/utils";
import React, { startTransition, useRef, useState } from "react";
import useSWR from "swr";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useAddEditRobModal from "@/app/[lang]/components/modals/AddEditRobModal";
import { getGroupPrintRob } from "@/actions/actions";

import useDeleteRobModal from "@/app/[lang]/components/modals/DeleteRobModal";
import { z } from "zod";
import { Robschema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { AddEditRobModal } from "@/app/[lang]/components/modals/AddEditRobModal";
import { DeleteRobModal } from "@/app/[lang]/components/modals/DeleteRobModal";
import ChargeCalculation from "./ChargeCalculation";
// import ComponentToPrint from "../../reports/components/groupfish";
import ComponentToPrint from "@/app/[lang]/components/prints/groupfishrob";

type Props = {};

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editrob, setEditrob] = useState<z.infer<typeof Robschema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<string>("");
  const [delLable2, setDelLable2] = useState<string>("");
  const [print, setPrint] = useState<any>();
  const [printData, setPrintData] = useState<any>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditRobModal();
  const _DeleteRobModal = useDeleteRobModal();
  const _TwainModal = useTwainModal();
  let per = permission?.user?.Permission?.find((item) => {
    return item.systemID === 9 && item.edit === true;
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

  // const pelak = searchParams.get("pelak")?.toUpperCase();
  const pelak = useParams();
  const AddRecord = () => {
    setEditrob({
      price: "",
      paydate: "",
      paydiscription: "",
      disc: "",
      invitedate: "",
      pelak: pelak ? pelak?.pelak.toString() : "",
      id: 0,
      created_user: 0,
      updated_user: 0,
      created_at: "",
      updated_at: "",
    });

    setTimeout(() => {
      AddUserModal.onOpen("");
    }, 100);
  };
  const {
    data: rob,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Robschema>[]>(
    `/api/rob?pelak=${pelak ? `${pelak?.pelak.toString()}` : ""}${
      searchParams ? `&${searchParams}` : ``
    } `,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );
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
      rowId: rowData.id,
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
  const handleDeleteClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        setDeleteID(rowData.id);
        setDelLable1(`پلاک : ${rowData.pelak}`);
        setDelLable2(rowData.tlname + " " + rowData.tfname);
        setTimeout(() => {
          _DeleteRobModal.onOpen(rowData.id);
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

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AwesomeFileName",
  });

  const handlePrintClick = async (rowData: any) => {
    setPrint(rowData);

    // const [_store]: any = await Promise.all([
    //   fetch("/api/store/" + rowData?.pelak).then(async (res) => {
    //     if (res.status === 200) {
    //       const val = await res.json();
    //       setPrintStore(val);
    //       return val;
    //     }
    //   }),
    // ]);

    // const [_chargedef] = await Promise.all([
    //   fetch("/api/chargedef/" + _store?.chargeProfile).then(async (res) => {
    //     if (res.status === 200) {
    //       const val = await res.json();
    //       //  //console.log("_defff", val);

    //       setPrintChargeDef(val);
    //     }
    //   }),
    // ]);
    //@ts-ignore
    startTransition(async () => {
      const ret = await getGroupPrintRob(
        rowData?.month,
        "",
        rowData?.pelak,
        "",
        "",

        rowData?.id
      );
      console.log(">>>", rowData);
      console.log(">>>", ret);
      setPrintData(ret);

      setTimeout(() => {
        handlePrint();
      }, 100);
    });

    ////console.log(rowData);
  };

  const handleActionClick = (rowData: any) => {
    const promise = () =>
      new Promise((resolve) => {
        fetch("/api/rob/" + (rowData.id !== "" ? rowData.id : "1")).then(
          async (res) => {
            if (res.status === 200) {
              const val = await res.json();
              setEditrob(val);
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

  const firstWithStartDate = rob?.find((item) => item?.invitedate?.trim());
  
  // Calculate sum of all prices
  const totalPaidAmount = rob?.reduce((sum, item) => {
    const price = parseFloat(item.price || '0');
    return sum + price;
  }, 0) || 0;
  
  if (rob) {
    console.log(">>>", rob);
  }
  return (
    <div>
      {/* <ChargeCalculation startDate="۱۳۹۱/۰۲/۰۳" rate={27.9} /> */}

      {firstWithStartDate && (
        <ChargeCalculation
          //@ts-ignore
          startDate={firstWithStartDate?.invitedate} // اولین مقدارِ startdate که خالی نیست
          //@ts-ignore
          rate={firstWithStartDate?.metraj} // متراژ همان رکورد
          totalPaidAmount={totalPaidAmount} // مجموع مبالغ پرداخت شده
          pelak={firstWithStartDate?.pelak} // شماره پلاک
        />
      )}

      <TwainModal mutation={mutate}></TwainModal>
      <DeleteRobModal
        mutation={mutate}
        data={deleteID}
        delLabel1={delLable1}
        delLabel2={delLable2}
      ></DeleteRobModal>
      <AddEditRobModal mutation={mutate} data={editrob}></AddEditRobModal>
      <div className="flex flex-col p-2 py-4 text-slate-400 text-sm">
        <div>
          <div> امکانات / سرقفلی</div>
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
      <ComponentToPrint
        data={printData}
        // chargeDef={printChargeDef}
        // store={printStore}
        ref={componentRef}
      />
      {canAction.add && pelak?.pelak != "all" ? (
        <Button
          className=" shadow-[#6d93ec]/50 border-0 bg-[#6d93ec] mr-28 h-8 hover:bg-[#4471da] "
          onClick={AddRecord}
          variant={"outline"}
        >
          <PlusCircle className="mx-1 h-4 w-4 text-white" />
          <span className="text-white">پرداخت جدید</span>
        </Button>
      ) : (
        <div className="h-8"></div>
      )}
      {rob ? (
        rob.length > 0 ? (
          <>
            <DataTable
              hiddenCol={{}}
              columns={columns}
              data={rob}
              onPrintClick={handlePrintClick}
              isLoading={isLoading}
              showPrint={true}
              onActionClick={handleActionClick}
              onDeleteClick={handleDeleteClick}
              onFileClick={handleFileClick}
              // onPrintClick={handlePrintClick}
              onNewFileClick={handleNewFileClick}
              allowEdit={canAction?.edit}
              allowDelete={canAction?.print}
              docadd={canAction?.docadd}
              docedit={canAction?.docedit}
              docview={canAction?.docview}
            ></DataTable>
          </>
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
