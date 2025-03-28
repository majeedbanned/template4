"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { StoreProps } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

import useTwainModal, {
  TwainModal,
} from "@/app/[lang]/components/modals/TwainModal";
import { encodeObjectToHashedQueryString, fetcher } from "@/lib/utils";
import React, { startTransition, useEffect, useRef, useState } from "react";
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
import { any, z } from "zod";
import { Chargechema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import useAddEditChargeModal, {
  AddEditChargeModal,
} from "@/app/[lang]/components/modals/AddEditChargeModal";
// import ComponentToPrint from "@/app/[lang]/components/prints/fish";
import { useReactToPrint } from "react-to-print";
import { redirect } from "next/navigation";
import { getGroupPrint } from "@/actions/actions";
import ComponentToPrint from "@/app/[lang]/components/prints/groupfish";
import { Checkbox } from "@/components/ui/checkbox";

export default function Datalist({
  permission,
}: {
  permission?: Session | null;
}) {
  const pelak = useParams();
  const [printData, setPrintData] = useState<any>([]);

  const [editCharge, seteditCharge] = useState<z.infer<typeof Chargechema>>();
  const [deleteID, setDeleteID] = useState<string>("");
  const [delLable1, setDelLable1] = useState<any>();
  const [print, setPrint] = useState<any>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditChargeModal();
  const _DeleteChargeModal = useDeleteChargeModal();
  const [printStore, setPrintStore] = useState();
  const [printChargeDef, setPrintChargeDef] = useState();
  const _TwainModal = useTwainModal();

  // let per = permission?.user?.Permission?.find((item) => {
  //   return item.systemID === 1 && item.edit === true;
  // });

  //let canAction;
  //if (permission?.user.role === "admin") {
  let canAction = {
    add: true,
    edit: true,
    print: true,
    view: true,
    docedit: true,
    docadd: true,
    docview: true,
  };

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
  ////console.log("first>", permission?.user.pelak);
  const {
    data: charges,
    isLoading,
    mutate,
  } = useSWR<StoreProps[]>(
    //@ts-ignore

    `/api/charge?pelak=${permission?.user.pelak}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const { data: stores, isLoading: isLoadingS } = useSWR<StoreProps[]>(
    //@ts-ignore

    `/api/store?search=${permission?.user.pelak}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  ////console.log("isLoadingS >", stores);
  // useEffect(() => {

  //   const promise = () =>
  //     new Promise((resolve) =>
  //       // setTimeout(() => resolve({ name: "Sonner" }), 2000)
  //       fetch("/api/store?search=9999-X")
  //     );

  //   toast.promise(promise, {
  //     loading: "Loading...",
  //     success: (data) => {
  //       return `${JSON.stringify(data)} toast has been added`;
  //     },
  //     error: "Error",
  //   });
  // }, []);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AwesomeFileName",
  });

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOmidPaymentClick = async (rowData: any) => {
    // //console.log(rowData);
    //return;
    setLoading(true);
    setError(null);

    try {
      const ammount = rowData.TotalBill - rowData.paidBill;
      const res = await fetch("/api/paymentomid", {
        method: "POST",
        body: new URLSearchParams({
          TerminalID: "",
          Amount: String(ammount),
          //Amount: "15000",

          invoiceID: rowData.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      console.log(data);
      // return;
      // Dynamically create and submit the form
      const form = document.createElement("form");
      form.method = "post";
      //form.action = "https://say.shaparak.ir/_ipgw_/merchant/token";
      form.action = "https://say.shaparak.ir/_ipgw_//MainTemplate/payment/";

      const terminalIDInput = document.createElement("input");
      terminalIDInput.type = "text";
      terminalIDInput.name = "language";
      terminalIDInput.value = "fa";
      form.appendChild(terminalIDInput);
      console.log("data.Token", data.Token);
      const tokenInput = document.createElement("input");
      tokenInput.type = "text";
      tokenInput.name = "token";
      tokenInput.value = data.Token; // Assuming 'AccessToken' is returned in the response
      form.appendChild(tokenInput);

      // const callbackInput = document.createElement("input");
      // callbackInput.type = "text";
      // callbackInput.name = "callbackURL";
      // callbackInput.value =
      //   "https://charge.persiangulfmall.com/fa/admin/callback"; // Assuming 'AccessToken' is returned in the response
      // form.appendChild(callbackInput);

      // const getMethodInput = document.createElement("input");
      // getMethodInput.type = "hidden";
      // getMethodInput.name = "getMethod";
      // getMethodInput.value = "0";
      // form.appendChild(getMethodInput);

      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "پرداخت";
      submitButton.className = "submit";
      form.appendChild(submitButton);

      document.body.appendChild(form);
      form.submit();

      //console.log(data);
      //setResponse(data);
    } catch (err) {
      setError("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = async (rowData: any) => {
    // //console.log(rowData);
    //return;
    setLoading(true);
    setError(null);

    try {
      const ammount = rowData.TotalBill - rowData.paidBill;
      const res = await fetch("/api/payment", {
        method: "POST",
        body: new URLSearchParams({
          TerminalID: "",
          Amount: String(ammount),
          //Amount: "15000",

          invoiceID: rowData.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      // //console.log(data);
      // return;
      // Dynamically create and submit the form
      const form = document.createElement("form");
      form.method = "post";
      form.action = "https://sepehr.shaparak.ir:8080/Pay";

      const terminalIDInput = document.createElement("input");
      terminalIDInput.type = "text";
      terminalIDInput.name = "TerminalID";
      terminalIDInput.value = "98780551";
      form.appendChild(terminalIDInput);

      const tokenInput = document.createElement("input");
      tokenInput.type = "text";
      tokenInput.name = "token";
      tokenInput.value = data.Accesstoken; // Assuming 'AccessToken' is returned in the response
      form.appendChild(tokenInput);

      // const callbackInput = document.createElement("input");
      // callbackInput.type = "text";
      // callbackInput.name = "callbackURL";
      // callbackInput.value =
      //   "https://charge.persiangulfmall.com/fa/admin/callback"; // Assuming 'AccessToken' is returned in the response
      // form.appendChild(callbackInput);

      const getMethodInput = document.createElement("input");
      getMethodInput.type = "hidden";
      getMethodInput.name = "getMethod";
      getMethodInput.value = "0";
      form.appendChild(getMethodInput);

      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "پرداخت";
      submitButton.className = "submit";
      form.appendChild(submitButton);

      document.body.appendChild(form);
      form.submit();

      //console.log(data);
      //setResponse(data);
    } catch (err) {
      setError("Error submitting form");
    } finally {
      setLoading(false);
    }
  };
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
      const ret = await getGroupPrint(
        rowData?.month,
        "",
        rowData?.pelak,
        "",
        ""
      );
      //console.log(ret);
      setPrintData(ret);

      setTimeout(() => {
        handlePrint();
      }, 100);
    });

    ////console.log(rowData);
  };

  const handleDeleteClick = (rowData: any) => {
    //console.log(rowData);
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

  const today = new Date();

  // Use Intl.DateTimeFormat with Persian locale
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Format the date
  const persianDate = formatter.format(today);

  // Split the formatted date into year and month
  const [persianYear, persianMonth] = persianDate.split("/");

  // Combine year and month in the desired format (keeping English numerals)
  const formattedDate = `${persianYear}-${persianMonth}`;

  console.log(formattedDate);
  return (
    <div>
      <TwainModal mutation={mutate}></TwainModal>
      <DeleteChargeModal
        mutation={mutate}
        data={deleteID}
        row={delLable1}
      ></DeleteChargeModal>
      <AddEditChargeModal
        role={permission?.user.role}
        mutation={mutate}
        data={editCharge}
      ></AddEditChargeModal>
      <div className="flex flex-col p-2 py-4 text-blue-400 text-sm">
        <div>
          <div> لیست شارژ</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap"></div>
      </div>
      <p className="flex flex-row gap-4 justify-center items-center bg-sky-100 border-sky-100 border p-1 my-2 rounded-lg">
        <p className="text-[12px]">{!isLoadingS && stores && stores[0].name}</p>
      </p>

      {/* <ComponentToPrint
        data={print}
        chargeDef={printChargeDef}
        store={printStore}
        ref={componentRef}
      /> */}

      <ComponentToPrint
        data={printData}
        // chargeDef={printChargeDef}
        // store={printStore}
        ref={componentRef}
      />

      {false ? (
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
            formattedDate={formattedDate}
            hiddenCol={{
              "بدهی قبلی": false,
              جریمه: false,
              ماه: false,
              "تاریخ پرداخت": false,
              "مهلت پرداخت": false,
              "بستانکاراز قبل": false,
              کد: false,
              "مانده بستانکاری": false,
              "اضافه پرداخت": false,
            }}
            columns={columns}
            data={charges}
            showPrint={true}
            isLoading={isLoading}
            onActionClick={handleActionClick}
            onDeleteClick={handleDeleteClick}
            onPrintClick={handlePrintClick}
            onPaymentClick={handlePaymentClick}
            onOmidPaymentClick={handleOmidPaymentClick}
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
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex flex-col">
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
