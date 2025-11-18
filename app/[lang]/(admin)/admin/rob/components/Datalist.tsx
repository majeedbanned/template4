"use client";
import { columns } from "@/app/[lang]/(admin)/admin/rob/components/columns";
import { DataTable } from "@/app/[lang]/(admin)/admin/stores/components/data-table";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
// import moment from "moment-jalaali";
import useTwainModal, {
  TwainModal,
} from "@/app/[lang]/components/modals/TwainModal";
import useDocumentUploadModal, {
  DocumentUploadModal,
} from "@/app/[lang]/components/modals/DocumentUploadModal";
import {
  ViewAllDocumentsModal,
  useViewAllDocumentsModal,
} from "@/app/[lang]/components/modals/ViewAllDocumentsModal";
import useRobSearchModal, {
  RobSearchModal,
  RobSearchFilters,
} from "@/app/[lang]/components/modals/RobSearchModal";
import { fetcher } from "@/lib/utils";
import React, { startTransition, useEffect, useRef, useState } from "react";
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
import { promise, z } from "zod";
import { Robschema } from "@/lib/schemas";
import { toast } from "sonner";
import { rejects } from "assert";
import { PlusCircle, Search, TrendingUp, FileText, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [editstore, setEditstore] = useState<any>();
  const [print, setPrint] = useState<any>();
  const [printData, setPrintData] = useState<any>([]);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const AddUserModal = useAddEditRobModal();
  const _DeleteRobModal = useDeleteRobModal();
  const _TwainModal = useTwainModal();
  const _DocumentUploadModal = useDocumentUploadModal();
  const _ViewAllDocumentsModal = useViewAllDocumentsModal();
  const robSearchModal = useRobSearchModal();
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
  const params = useParams();
  const pelakValue = params?.pelak;

  console.log(">>>", pelakValue);

  const pelak = params;
  useEffect(() => {
    if (!pelakValue) return;
  
    const fetchStore = async () => {
      try {
        const response = await fetch("/api/store/" + pelakValue);
        if (response.status === 200) {
          const val = await response.json();
          console.log("✅ Store info loaded", val);
          setEditstore(val);
        } else {
          const error = await response.text();
          toast.error(error);
        }
      } catch (err) {
        toast.error("Something went wrong while fetching store info");
      }
    };
  
    fetchStore();
  }, [pelakValue]);
  
  



  
  const AddRecord = () => {
    setEditrob({
      price: "",
      discount: "",
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
  // Build query string with search filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    // Add pelak param
    if (pelak?.pelak) {
      params.append("pelak", pelak.pelak.toString());
    }

    // Add basic search if exists
    const basicSearch = searchParams.get("search");
    if (basicSearch) {
      params.append("search", basicSearch);
    }

    // Add advanced search filters
    const filters = robSearchModal.filters;
    if (filters.pelak) params.append("pelakFilter", filters.pelak);
    if (filters.disc) params.append("discFilter", filters.disc);
    if (filters.paydiscription) params.append("paydiscriptionFilter", filters.paydiscription);
    if (filters.invitedateFrom) params.append("invitedateFrom", filters.invitedateFrom);
    if (filters.invitedateTo) params.append("invitedateTo", filters.invitedateTo);
    if (filters.paydateFrom) params.append("paydateFrom", filters.paydateFrom);
    if (filters.paydateTo) params.append("paydateTo", filters.paydateTo);
    if (filters.created_atFrom) params.append("created_atFrom", filters.created_atFrom);
    if (filters.created_atTo) params.append("created_atTo", filters.created_atTo);
    if (filters.updated_atFrom) params.append("updated_atFrom", filters.updated_atFrom);
    if (filters.updated_atTo) params.append("updated_atTo", filters.updated_atTo);
    if (filters.priceMin !== undefined) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append("priceMax", filters.priceMax.toString());
    if (filters.discountMin !== undefined) params.append("discountMin", filters.discountMin.toString());
    if (filters.discountMax !== undefined) params.append("discountMax", filters.discountMax.toString());
    if (filters.created_user !== undefined) params.append("created_user", filters.created_user.toString());
    if (filters.updated_user !== undefined) params.append("updated_user", filters.updated_user.toString());

    return params.toString();
  };

  const {
    data: rob,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof Robschema>[]>(
    `/api/rob?${buildQueryString()}`,
    fetcher,
    {
      // revalidateOnMount: true,
    }
  );

  const handleSearch = (filters: RobSearchFilters) => {
    robSearchModal.setFilters(filters);
    mutate();
  };
  const handleFileClick = async (rowData: any, id: any) => {
    // Find the file to get its category
    const clickedFile = rowData.Doc_files?.find((file: any) => file.id === id);
    if (!clickedFile) {
      toast.error("فایل یافت نشد");
      return;
    }

    // Find the category
    const category = rowData.list?.find((doc: any) => doc.id === clickedFile.CatID);
    if (!category) {
      toast.error("دسته‌بندی یافت نشد");
      return;
    }

    // Prepare data for edit mode
    const uploadData = {
      moduleID: category.moduleId || 3, // 3 is for rob
      CatID: category.id,
      pelak: rowData.pelak,
      rowId: rowData.id, // Rob uses 'id' instead of 'trow'
      userID: 1, // Get from session if available
      categoryTitle: category.title,
      mode: "edit" as const,
      availableCategories: rowData.list || [],
      existingFiles: rowData.Doc_files?.filter(
        (file: any) => file.CatID === category.id
      ).map((file: any) => ({
        id: file.id,
        name: file.name,
        isExisting: true,
        CatID: file.CatID,
        date_: file.date_,
        Doc_cat: file.Doc_cat,
      })) || [],
    };

    setTimeout(() => {
      _DocumentUploadModal.onOpen(uploadData);
    }, 100);
  };
  const handleNewFileClick = (rowData: any, id: any) => {
    const category = rowData.list?.find((doc: any) => doc.id === id) ?? {};
    
    // Prepare data for document upload modal (add mode)
    const uploadData = {
      moduleID: category.moduleId || 3, // 3 is for rob
      CatID: category.id,
      pelak: rowData.pelak,
      rowId: rowData.id, // Rob uses 'id' instead of 'trow'
      userID: 1, // Get from session if available
      categoryTitle: category.title,
      mode: "add" as const,
      availableCategories: rowData.list || [],
      existingFiles: rowData.Doc_files?.filter(
        (file: any) => file.CatID === category.id
      ).map((file: any) => ({
        id: file.id,
        name: file.name,
        isExisting: true,
        CatID: file.CatID,
        date_: file.date_,
        Doc_cat: file.Doc_cat,
      })) || [],
    };

    setTimeout(() => {
      _DocumentUploadModal.onOpen(uploadData);
    }, 100);
  };

  const handleViewAllDocuments = (rowData: any) => {
    const documents = rowData.Doc_files || [];
    _ViewAllDocumentsModal.onOpen({
      pelak: rowData.pelak,
      documents: documents.map((file: any) => ({
        id: file.id,
        name: file.name,
        CatID: file.CatID,
        date_: file.date_,
        Doc_cat: file.Doc_cat,
        moduleID: file.moduleID || 3,
      })),
      moduleID: 3, // Rob module ID
    });
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
  
  // Calculate statistics
  const totalGrossAmount = rob?.reduce((sum, item) => {
    const price = parseFloat(item.price || '0');
    return sum + price;
  }, 0) || 0;

  const totalDiscount = rob?.reduce((sum, item) => {
    const discount = parseFloat((item as any).discount || '0');
    return sum + discount;
  }, 0) || 0;

  // Total paid amount after discount
  const totalPaidAmount = totalGrossAmount - totalDiscount;

  const totalRecords = rob?.length || 0;
  const averageAmount = totalRecords > 0 ? totalPaidAmount / totalRecords : 0;
  const averageDiscount = totalRecords > 0 ? totalDiscount / totalRecords : 0;
  
  const recordsWithPaymentDate = rob?.filter(item => item.paydate && item.paydate.trim()).length || 0;
  const recordsWithoutPaymentDate = totalRecords - recordsWithPaymentDate;
  
  const recordsWithInviteDate = rob?.filter(item => item.invitedate && item.invitedate.trim()).length || 0;
  const recordsWithDiscount = rob?.filter(item => (item as any).discount && parseFloat((item as any).discount) > 0).length || 0;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
    }).format(amount).replace("ریال", "");
  };
  
  if (rob) {
    console.log(">>>", rob);
  }
  // Check if pelak is "all" to hide ChargeCalculation
  const isAllPelak = pelak?.pelak === "all";

  return (
    <div>
      {/* <ChargeCalculation startDate="۱۳۹۱/۰۲/۰۳" rate={27.9} /> */}

      {!isAllPelak && firstWithStartDate && editstore && (
        <ChargeCalculation
          //@ts-ignore
          startDate={firstWithStartDate?.invitedate} // اولین مقدارِ startdate که خالی نیست
          //@ts-ignore
          rate={firstWithStartDate?.metraj} // متراژ همان رکورد
          totalPaidAmount={totalPaidAmount} // مجموع مبالغ پرداخت شده
          pelak={firstWithStartDate?.pelak} // شماره پلاک
          editstore={editstore}
          
        />
      )}

      <TwainModal mutation={mutate}></TwainModal>
      <DocumentUploadModal mutation={mutate}></DocumentUploadModal>
      <ViewAllDocumentsModal />
      <RobSearchModal onSearch={handleSearch} />
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
          <Button
            variant="outline"
            onClick={() => robSearchModal.onOpen()}
            className="h-8 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            جستجوی پیشرفته
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {rob && rob.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 px-2">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                تعداد کل رکوردها
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {totalRecords.toLocaleString("fa-IR")}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                رکورد موجود در سیستم
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مجموع مبالغ پرداختی
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalPaidAmount)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {totalDiscount > 0 ? (
                  <span>
                    پس از کسر تخفیف ({formatCurrency(totalDiscount)})
                  </span>
                ) : (
                  "ریال"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                میانگین مبلغ
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(averageAmount)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                ریال به ازای هر رکورد
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت پرداخت
              </CardTitle>
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">پرداخت شده:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {recordsWithPaymentDate.toLocaleString("fa-IR")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">بدون پرداخت:</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {recordsWithoutPaymentDate.toLocaleString("fa-IR")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">دارای دعوتنامه:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {recordsWithInviteDate.toLocaleString("fa-IR")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">دارای تخفیف:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {recordsWithDiscount.toLocaleString("fa-IR")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              onViewAllDocuments={handleViewAllDocuments}
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
