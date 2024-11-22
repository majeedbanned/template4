"use client";

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
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const AddEditTenantModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Tenantschema>;
}) => {
  const AddEditTenantModal = useAddEditTenantModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Tenantschema>>({
    resolver: zodResolver(Tenantschema),
    defaultValues: AddEditTenantModal.editID !== "" ? data : {},
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    //return;
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
          AddEditTenantModal.onClose();
          toast.success(endpoint.successMessage);
          await mutation();
        } else if (res.status === 422) {
          toast.error("پلاک تکراری است");
        } else {
          toast.error(res.statusText);
        }
      }, 3);
    });
  };

  // const onToggle = useCallback(() => {
  //   AddEditTenantModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditTenantModal]);

  const endpoint = useMemo(() => {
    if (AddEditTenantModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/tenant`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/tenant`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditTenantModal.editID]);

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pelak"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> پلاک :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={true} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tfname"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tablo"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام تابلو :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tlname"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام خانوادگی :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tfather"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام پدر :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tmeli"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> کد ملی :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tmobile"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> شماره همراه :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stdate"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>: تاریخ شروع قرارداد </FormLabel>
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
          name="endate"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>: تاریخ پایان قرارداد </FormLabel>
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
          name="tjob"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> صنف :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* تاریخ مجوز کاربری */}
        <FormField
          control={form.control}
          name="datemojavez"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>: تاریخ مجوز کاربری </FormLabel>
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
          name="ttel"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> وکیل/ نماینده :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taddress"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> آدرس پلاک :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disc"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> توضیحات :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea disabled={isLoading} placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* توضیحات */}

        <div>{error}</div>
      </form>
    </Form>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddEditTenantModal.isOpen}
      title={
        AddEditTenantModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditTenantModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditTenantModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditTenantModal.onClose}
      onClose={AddEditTenantModal.onClose}
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
import { toast } from "sonner";
import { Tenantschema } from "@/lib/schemas";
import DatePicker from "react-multi-date-picker";
import { Textarea } from "@/components/ui/textarea";

interface AddEditTenantModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditTenantModal = create<AddEditTenantModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditTenantModal;
