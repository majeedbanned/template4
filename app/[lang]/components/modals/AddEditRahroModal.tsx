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

export const AddEditRahroModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Rahroschema>;
}) => {
  const AddEditRahroModal = useAddEditRahroModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Rahroschema>>({
    resolver: zodResolver(Rahroschema),
    defaultValues: AddEditRahroModal.editID !== "" ? data : {},
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
          AddEditRahroModal.onClose();
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
    if (AddEditRahroModal.editID !== "") {
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
  }, [AddEditRahroModal.editID]);

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
    <Modal
      actionLabelVariant={"default"}
      disabled={isLoading}
      isOpen={AddEditRahroModal.isOpen}
      title={
        AddEditRahroModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditRahroModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditRahroModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditRahroModal.onClose}
      onClose={AddEditRahroModal.onClose}
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

interface AddEditRahroModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditRahroModal = create<AddEditRahroModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditRahroModal;
