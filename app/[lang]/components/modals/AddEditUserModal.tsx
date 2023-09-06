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
  "تعریف واحد",
  "مدیریت شارژ",
  "مستاجرین",
  "مالکین",
];
const locations = ["نمایش", "ویرایش", "حذف", "افزودن"];

export const AddEditUserModal = ({
  mutation,
  data,
}: {
  mutation: () => void;
  data?: z.infer<typeof Userschema>;
}) => {
  const AddEditUserModal = useAddEditUserModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof Userschema>>({
    resolver: zodResolver(Userschema),
    defaultValues: AddEditUserModal.editID !== "" ? data : {},
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "access",
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
          AddEditUserModal.onClose();
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
  //   AddEditUserModal.onClose();
  //   //  registerModal.onOpen();
  // }, [AddEditUserModal]);

  const endpoint = useMemo(() => {
    if (AddEditUserModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/users`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/users`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [AddEditUserModal.editID]);

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
          name="lname"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> فامیل :</FormLabel>
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
          name="username"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> نام کاربری :</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel> کلمه عبور :</FormLabel>
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className=" flex flex-row justify-between">
                <FormLabel> نقش :</FormLabel>

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
                  <SelectItem key={1} value="admin">
                    {"admin"}
                  </SelectItem>
                  <SelectItem key={2} value="user">
                    {"user"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="">
              <div className="space-y-0.5">
                <FormLabel className="text-base">وضعیت :</FormLabel>
                <FormDescription>غیر فعال / فعال</FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="border"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <h2>سطح دسترسی</h2>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex flex-row items-center gap-2 justify-between">
              <div className=" rounded-sm ">
                <Controller
                  //@ts-ignore
                  name={`access[${index}].systems`}
                  control={form.control}
                  render={({ field }) => (
                    <div>
                      <p>نام سیستم:</p>

                      <select
                        onChange={field.onChange}
                        value={field.value?.toString()}
                        className="border text-blue-400 rounded-lg p-2 w-full"
                        //@ts-nocheck
                        // {...field}
                      >
                        {systems.map((degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />
                <Controller
                  //@ts-ignore
                  name={`access[${index}].locations`}
                  control={form.control}
                  render={({ field }) => (
                    <div>
                      {locations.map((location) => {
                        //if(field?.value?.includes(location))
                        return (
                          <label className=" text-sm" key={location}>
                            <input
                              className="m-2 text-sm"
                              checked={field?.value
                                ?.toString()
                                .includes(location)}
                              type="checkbox"
                              value={location}
                              onChange={(e) => {
                                //@ts-ignore
                                const selectedLocations: string[] =
                                  field.value || [];
                                if (e.target.checked) {
                                  selectedLocations.push(e.target.value);
                                } else {
                                  const index = selectedLocations.indexOf(
                                    e.target.value
                                  );
                                  if (index !== -1) {
                                    selectedLocations.splice(index, 1);
                                  }
                                }
                                field.onChange(selectedLocations);
                              }}
                            />
                            {location}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => remove(index)}
              >
                <TrashIcon className="w-4 h-4"></TrashIcon>
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="h-8 w-full  p-4"
          onClick={() => append({ systems: "", locations: [] })}
        >
          <PlusCircle className="w-4 h-4 "></PlusCircle>
          دسترسی جدید
        </Button>

        <div>{error}</div>
      </form>
    </Form>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddEditUserModal.isOpen}
      title={
        AddEditUserModal.editID === ""
          ? "ثبت رکورد جدید"
          : "ویرایش پلاک " + AddEditUserModal.editID
      }
      // "افزودن واحد"
      actionLabel={AddEditUserModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditUserModal.onClose}
      onClose={AddEditUserModal.onClose}
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
import { Userschema } from "@/lib/schemas";
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

interface AddEditUserModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditUserModal = create<AddEditUserModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditUserModal;
