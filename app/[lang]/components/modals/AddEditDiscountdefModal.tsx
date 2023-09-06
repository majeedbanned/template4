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

export const AddEditDiscountdefModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Discountdefschema>;
}) => {
  const AddEditDiscountdefModal = useAddEditDiscountdefModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Discountdefschema>>({
    resolver: zodResolver(Discountdefschema),
    defaultValues: AddEditDiscountdefModal.editID !== "" ? data : {},
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
          AddEditDiscountdefModal.onClose();
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
  //   AddEditDiscountdefModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditDiscountdefModal]);

  const endpoint = useMemo(() => {
    if (AddEditDiscountdefModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/discountdef`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/discountdef`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditDiscountdefModal.editID]);

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
          name="discountPersand"
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
                    form.getValues("discountPersand")?.toString() || ""
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
      isOpen={AddEditDiscountdefModal.isOpen}
      title={
        AddEditDiscountdefModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditDiscountdefModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditDiscountdefModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditDiscountdefModal.onClose}
      onClose={AddEditDiscountdefModal.onClose}
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
import { Discountdefschema, Userschema } from "@/lib/schemas";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddEditDiscountdefModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditDiscountdefModal = create<AddEditDiscountdefModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditDiscountdefModal;
