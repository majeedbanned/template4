"use client";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

import { useCallback, useEffect, useMemo, useState } from "react";
//import { toast } from "react-hot-toast";
import { FilterOptions } from "@/lib/types";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const AddEditChargeModal = ({
  role,
  mutation,
  bazar,
  rahro,
  nov,
  tabagh,
  data,
}: {
  role?: string;
  mutation: () => void;
  bazar?: FilterOptions[];
  rahro?: FilterOptions[];
  nov?: FilterOptions[];
  tabagh?: FilterOptions[];
  data?: z.infer<typeof Chargechema>;
}) => {
  const router = useRouter();
  const AddEditChargeModal = useAddEditChargeModal();
  const [isLoading, setIsLoading] = useState(false);
  // const { filters: _bazar } = useFilter({ filter: "bazar" });
  // const { filters: _tabagh } = useFilter({ filter: "tabagh" });
  // const { filters: _nov } = useFilter({ filter: "nov" });
  // const { filters: _rahro } = useFilter({ filter: "rahro" });
  // const [hooksCompleted, setHooksCompleted] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editstore, setEditstore] = useState<z.infer<typeof Chargechema>>();
  const [tmp, setTmp] = useState(false);
  const [portalTarget, setPortalTaget] = useState();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Chargechema>>({
    resolver: zodResolver(Chargechema),
    defaultValues: AddEditChargeModal.editID !== "" ? data : {},
    //   AddEditStoreModal.editID === "add"
    //     ? {}
    //     : async () => {
    //         ////console.log("start");
    //         return await fetch("/api/store/" + AddEditStoreModal.editID).then(
    //           (res) => res.json()
    //         );
    //       },
  });
  const __discount = form.watch("discount");
  const __paidBiil = form.watch("paidBill");
  const __debt = form.watch("debt");
  const __monthbill = form.watch("monthbill");
  const __penalty = form.watch("penalty");
  const __paidExtra = form.watch("paidExtra");
  const __paidExtraAsset = form.watch("paidExtraAsset");

  // useEffect(() => {
  //   const portalDiv = document.createElement("div");

  //   /**
  //    * This ID is optional and has been added
  //    * to better recognize it in the DOM tree.
  //    */
  //   portalDiv.id = "myPortalDiv";

  //   document.body.appendChild(portalDiv);

  //   setPortalTaget(portalDiv);

  //   return () => document.body.removeChild(portalDiv);
  // }, []);

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  useEffect(() => {
    // //console.log(__monthbill, __discount);
    let newval =
      Number(__monthbill) +
      Number(__debt?.toString().replace(/,/g, "")) +
      Number(__penalty?.toString().replace(/,/g, "")) -
      Number(__discount?.toString().replace(/,/g, "")) -
      Number(__paidExtra?.toString().replace(/,/g, ""));
    if (newval < 0) newval = 0;
    form.setValue("TotalBill", newval);
    // //console.log("hi", Number(__paidBiil?.toString().replace(/,/g, "");

    // if (Number(__paidBiil?.toString().replace(/,/g, "")) > newval) {
    //   form.setValue(
    //     "paidExtraAsset",
    //     Number(__paidBiil?.toString().replace(/,/g, "")) - newval
    //   );
    //}
  }, [__discount, __debt, __penalty, __paidExtra, __paidBiil]);

  // Format numeric value with commas
  // const formatNumber = (value: string) => {
  //   if (!value) return "";
  //   value = value.replace(/\D/g, "");
  //   const characterToReplace = ",";
  //   const replacementCharacter = "";

  //   const nval = value.replace(
  //     new RegExp(characterToReplace, "g"),
  //     replacementCharacter
  //   );

  //   const amount = BigInt(nval.toEnglishDigits());

  //   // //console.log("naval", nval.toEnglishDigits());
  //   const formatted = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "IRR",
  //   }).format(amount);
  //   let ret = formatted.replace("IRR", "").trim();
  //   const y = ret.toPersianDigits();
  //   // //console.log("yyy", ret);
  //   return ret;
  // };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    //console.log(data);

    setIsLoading(true);
    await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      await setTimeout(async () => {
        setIsLoading(false);
        if (res.status === 200) {
          //** */ mutate(`/api/projects/${slug}/domains`);
          AddEditChargeModal.onClose();
          toast.success(endpoint.successMessage);
          await mutation();
          // mutate(`/api/store`, true).then((resp) => {
          //   setTmp(!tmp);
          // });

          // if (!props) {
          //   router.push(`/${slug}/domains`);
          // }
        } else if (res.status === 422) {
          //  const { domainError: domainErrorResponse } = await res.json();
          // if (domainErrorResponse) {
          toast.error("پلاک تکراری است");
        } else {
          ////console.log(res);
          if (res.statusText === "date")
            toast.error("لطفا تاریخ پرداخت را وارد نمایید");
          else toast.error(res.statusText);
        }
      }, 3);
    });
  };

  const onToggle = useCallback(() => {
    AddEditChargeModal.onClose();
    //  registerModal.onOpen();
  }, [AddEditChargeModal]);

  const endpoint = useMemo(() => {
    if (AddEditChargeModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/charge`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/charge`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditChargeModal.editID]);
  // const updateTotal = (val: string) => {
  //   form.setValue("discount", Number(val));

  //   form.setValue("monthbill", Number(val));
  // };

  const bodyContent = (
    <Form {...form}>
      {<div>{JSON.stringify(form.formState.errors)}</div>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tafkiki">پرداخت تفکیکی</TabsTrigger>

            <TabsTrigger value="password">اطلاعات پرداخت</TabsTrigger>

            <TabsTrigger value="account">صورتحساب</TabsTrigger>
          </TabsList>
          <TabsContent
            className="flex flex-col gap-4 justify-start"
            value="account"
          >
            <FormField
              control={form.control}
              name="TotalBill"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>:قابل پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      readOnly={role === "admin" ? false : true}
                      className="font-bold text-lg text-white border-0 bg-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={role === "admin" ? false : true}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("TotalBill")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidBill"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: مبلغ پرداخت شده</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidBill")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ezafPardakht"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: اضافه پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("ezafPardakht")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthbill"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>:شارژ ماهیانه </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      readOnly={role === "admin" ? false : true}
                      disabled={role === "admin" ? false : true}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("monthbill")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="penalty"
                render={({ field }) => (
                  <FormItem className="">
                    <div className=" flex flex-row-reverse justify-between">
                      <FormLabel>: جریمه</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="font-bold text-lg text-green-600 text-center"
                        placeholder=""
                        {...field}
                        disabled={role === "admin" ? false : true}
                        readOnly={role === "admin" ? false : true}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={field.onChange}
                        value={formatNumber(
                          form.getValues("penalty")?.toString() || ""
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="debt"
                render={({ field }) => (
                  <FormItem className="">
                    <div className=" flex flex-row-reverse justify-between">
                      <FormLabel>: بدهی از قبل </FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="font-bold text-lg text-green-600 text-center"
                        placeholder=""
                        {...field}
                        disabled={role === "admin" ? false : true}
                        readOnly={role === "admin" ? false : true}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={field.onChange}
                        value={formatNumber(
                          form.getValues("debt")?.toString() || ""
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="">
                    <div className=" flex flex-row-reverse justify-between">
                      <FormLabel>: تخفیف</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="font-bold text-lg text-red-600 text-center"
                        placeholder=""
                        {...field}
                        //    disabled={isLoading}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={role === "admin" ? false : true}
                        readOnly={role === "admin" ? false : true}
                        // onChange={field.onChange}
                        onChange={field.onChange}
                        value={formatNumber(
                          form.getValues("discount")?.toString() || ""
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidExtra"
                render={({ field }) => (
                  <FormItem className="">
                    <div className=" flex flex-row-reverse justify-between">
                      <FormLabel>: بستانکار از قبل</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        className="font-bold text-lg text-red-600 text-center"
                        placeholder=""
                        {...field}
                        disabled={role === "admin" ? false : true}
                        readOnly={role === "admin" ? false : true}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={field.onChange}
                        value={formatNumber(
                          form.getValues("paidExtra")?.toString() || ""
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="paidExtraAsset"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: مانده بستانکاری</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={role === "admin" ? false : true}
                      readOnly={role === "admin" ? false : true}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidExtraAsset")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deptPeriod"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: دوره بدهی</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-slate-600 text-center"
                      placeholder=""
                      {...field}
                      // disabled={role === "admin" ? false : true}
                      // readOnly={role === "admin" ? false : true}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      // value={formatNumber(form.getValues("debt")?.toString() || "")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent
            className="flex flex-col gap-4 justify-start"
            value="password"
          >
            <FormField
              control={form.control}
              name="paidDate"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: تاریخ پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value || ""}
                      onChange={(date) => {
                        field.onChange(date ? date.toString() : "");
                      }}
                      style={{
                        width: "100% !important",

                        height: "34px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "3px 10px !important",
                      }}
                      format={"YYYY/MM/DD"}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-center"
                    />
                    {/* {errors && errors[name] && errors[name].type === "required" && (
                //if you want to show an error message
                <span>your error message !</span>
              )} */}

                    {/* <Input
                      className="font-bold text-lg text-red-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidDate")?.toString() || ""
                      )}
                    /> */}
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidType"
              render={({ field }) => (
                <FormItem>
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: نوع پرداخت </FormLabel>

                    <FormMessage />
                  </div>
                  <Select
                    // @ts-ignore: Unreachable code error

                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="bg-white text-center">
                      <SelectTrigger className="text-center">
                        <SelectValue
                          style={{ textAlign: "center" }}
                          className="text-center "
                          placeholder="لطفا انتخاب کنید"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white text-center">
                      <SelectItem key={1} value={"پوز"}>
                        پوز
                      </SelectItem>
                      <SelectItem key={2} value={"پرداخت آنلاین"}>
                        پرداخت آنلاین
                      </SelectItem>
                      <SelectItem key={3} value={"واریز به حساب"}>
                        واریز به حساب
                      </SelectItem>
                      <SelectItem key={4} value={"پوز اطلاعات"}>
                        پوز اطلاعات
                      </SelectItem>
                      <SelectItem key={5} value={"پوز دفتر مرکزی"}>
                        پوز دفتر مرکزی
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discription"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel> : توضیحات </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="توضیحات"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fichnum"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel> : شماره فیش </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="شماره فیش"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent
            className="flex flex-col gap-4 justify-start"
            value="tafkiki"
          >
            <FormField
              control={form.control}
              name="paidDate1"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: تاریخ پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value || ""}
                      onChange={(date) => {
                        field.onChange(date ? date.toString() : "");
                      }}
                      style={{
                        width: "100% !important",

                        height: "34px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "3px 10px !important",
                      }}
                      format={"YYYY/MM/DD"}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidBill1"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: مبلغ پرداخت شده</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidBill1")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fich1"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel> : شماره فیش </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="شماره فیش"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <hr />

            <FormField
              control={form.control}
              name="paidDate2"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: تاریخ پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value || ""}
                      onChange={(date) => {
                        field.onChange(date ? date.toString() : "");
                      }}
                      style={{
                        width: "100% !important",

                        height: "34px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "3px 10px !important",
                      }}
                      format={"YYYY/MM/DD"}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidBill2"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: مبلغ پرداخت شده</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidBill2")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fich2"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel> : شماره فیش </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="شماره فیش"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <hr />

            <FormField
              control={form.control}
              name="paidDate3"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: تاریخ پرداخت </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value || ""}
                      onChange={(date) => {
                        field.onChange(date ? date.toString() : "");
                      }}
                      style={{
                        width: "100% !important",

                        height: "34px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "3px 10px !important",
                      }}
                      format={"YYYY/MM/DD"}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidBill3"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel>: مبلغ پرداخت شده</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="font-bold text-lg text-green-600 text-center"
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={field.onChange}
                      value={formatNumber(
                        form.getValues("paidBill3")?.toString() || ""
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fich3"
              render={({ field }) => (
                <FormItem className="">
                  <div className=" flex flex-row-reverse justify-between">
                    <FormLabel> : شماره فیش </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="شماره فیش"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <hr />
          </TabsContent>
        </Tabs>

        <div>{error}</div>
      </form>
    </Form>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  // if (hooksCompleted !== 4) return null;
  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddEditChargeModal.isOpen}
      // title={
      //   AddEditChargeModal.editID === ""
      //     ? "ثبت رکورد جدید"
      //     : "ویرایش پلاک " + AddEditChargeModal.editID
      // }
      title=""
      // "افزودن واحد"
      actionLabel={AddEditChargeModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditChargeModal.onClose}
      onClose={AddEditChargeModal.onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      description=""
    />
  );
};

import { create } from "zustand";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modaltall from "./Modaltall";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Chargechema } from "@/lib/schemas";
import { formatNumber } from "@/lib/utils";

interface AddEditChargeModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditChargeModal = create<AddEditChargeModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditChargeModal;
