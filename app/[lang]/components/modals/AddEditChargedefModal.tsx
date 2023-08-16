"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
//import { toast } from "react-hot-toast";
import { FilterOptions } from "@/lib/types";
import {
  FieldValues,
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const systems = [
  "لطفا انتخاب کنید",
  "مدیریت شارژ",
  "مستاجرین",
  "مالکین",
  "تعریف واحد ها",
];
const locations = ["نمایش", "ویرایش", "حذف", "افزودن"];

export const AddEditChargedefModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Chargedefschema>;
}) => {
  const AddEditChargedefModal = useAddEditChargedefModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Chargedefschema>>({
    resolver: zodResolver(Chargedefschema),
    defaultValues: AddEditChargedefModal.editID !== "" ? data : {},
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "education",
  // });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log(data);
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
          AddEditChargedefModal.onClose();
          toast.success(endpoint.successMessage);
          await mutation();
        } else if (res.status === 422) {
          toast.error("نام کاربری تکراری است");
        } else {
          toast.error(res.statusText);
        }
      }, 3);
    });
  };

  // const onToggle = useCallback(() => {
  //   AddEditChargedefModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditChargedefModal]);

  const endpoint = useMemo(() => {
    if (AddEditChargedefModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/chargedef`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/chargedef`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditChargedefModal.editID]);

  const bodyContent = (
    <Form {...form}>
      {/* <div>{JSON.stringify(form.formState.errors)}</div> */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام تعرفه :</FormLabel>
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
          name="charge"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> مبلغ شارژ :</FormLabel>
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
                    form.getValues("charge")?.toString() || ""
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="penaltyMonth"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> ماه جریمه :</FormLabel>
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
                    form.getValues("penaltyMonth")?.toString() || ""
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="penaltyPersand"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> درصد جریمه :</FormLabel>
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
                    form.getValues("penaltyPersand")?.toString() || ""
                  )}
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
      isOpen={AddEditChargedefModal.isOpen}
      title={
        AddEditChargedefModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditChargedefModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditChargedefModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditChargedefModal.onClose}
      onClose={AddEditChargedefModal.onClose}
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
import { Chargedefschema, Userschema } from "@/lib/schemas";
import DatePicker from "react-multi-date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Divide, PlusCircle } from "lucide-react";
import { Label } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Switch } from "@/components/ui/switch";
import { formatNumber } from "@/lib/utils";

interface AddEditChargedefModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditChargedefModal = create<AddEditChargedefModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditChargedefModal;
