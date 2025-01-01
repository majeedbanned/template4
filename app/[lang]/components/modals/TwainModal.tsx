"use client";

import { useEffect, useMemo, useState } from "react";
//import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const systems = [
  "لطفا انتخاب کنید",
  "مدیریت شارژ",
  "مستاجرین",
  "مالکین",
  "تعریف واحد ها",
];
const locations = ["نمایش", "ویرایش", "حذف", "افزودن"];

export const TwainModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Rahroschema>;
}) => {
  const TwainModal = useTwainModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Rahroschema>>({
    resolver: zodResolver(Rahroschema),
    defaultValues: TwainModal.editID !== "" ? data : {},
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "education",
  // });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // //console.log(data);
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
          TwainModal.onClose();
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
  //   AddEditRahroModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditRahroModal]);

  const endpoint = useMemo(() => {
    if (TwainModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/rahro`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/rahro`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [TwainModal.editID]);

  const bodyContent = (
    <Form {...form}>
      {/* <div>{JSON.stringify(form.formState.errors)}</div> */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rahro"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> عنوان :</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
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
    <ModalWide
      actionLabelVariant={"default"}
      disabled={isLoading}
      isOpen={TwainModal.isOpen}
      hash={TwainModal.editID}
      title={
        TwainModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + TwainModal.editID
      }
      // "افزودن واحد"
      actionLabel={TwainModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={TwainModal.onClose}
      onClose={TwainModal.onClose}
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
import { Rahroschema } from "@/lib/schemas";
import { formatNumber } from "@/lib/utils";
import Modal from "./Modal";
import ModalWide from "./ModalWide";

interface TwainModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: any) => void;
  onClose: () => void;
}

const useTwainModal = create<TwainModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useTwainModal;
