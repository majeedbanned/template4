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

export const AddEditRobModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Robschema>;
}) => {
  const AddEditRobModal = useAddEditRobModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Robschema>>({
    resolver: zodResolver(Robschema),
    defaultValues: AddEditRobModal.editID !== "" ? data : {},
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    //console.log(data);
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
          AddEditRobModal.onClose();
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
  //   AddEditRobModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditRobModal]);

  const endpoint = useMemo(() => {
    if (AddEditRobModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/rob`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/rob`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditRobModal.editID]);

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
          name="invitedate"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>: تاریخ دعوتنامه </FormLabel>
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
          name="paydiscription"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> توضیحات پرداخت:</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="توضیحات پرداخت"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paydate"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
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
          name="price"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> مبلغ :</FormLabel>
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
          name="discount"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> تخفیف (ریال) :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="number"
                  placeholder="مقدار تخفیف"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) || 0 : undefined);
                  }}
                />
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
                <Textarea
                  placeholder="توضیحات"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div>{error}</div>
      </form>
    </Form>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddEditRobModal.isOpen}
      title={
        AddEditRobModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditRobModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditRobModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditRobModal.onClose}
      onClose={AddEditRobModal.onClose}
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
import { Robschema } from "@/lib/schemas";
import DatePicker from "react-multi-date-picker";
import { Textarea } from "@/components/ui/textarea";

interface AddEditRobModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditRobModal = create<AddEditRobModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditRobModal;
