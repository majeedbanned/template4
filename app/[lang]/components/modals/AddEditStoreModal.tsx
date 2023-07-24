"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
//import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FilterOptions, StoreProps } from "@/lib/types";

import {
  FieldValues,
  SubmitHandler,
  useForm,
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
// const StoreSchema = z.object({
//   pelakCH: z
//     .string({
//       invalid_type_error: "کاراکتر",
//     })
//     .min(1, { message: "*" })
//     .max(1, { message: "*" }),
//   pelakNU: z
//     .number({
//       invalid_type_error: "مقدار عددی  وارد کنید",
//     })
//     .positive({ message: "مقدار عددی مثبت وارد کنید" })
//     .int({ message: "مقدار عددی  وارد کنید" })
//     .or(z.string())
//     .pipe(
//       z.coerce
//         .number({
//           invalid_type_error: "مقدار عددی  وارد کنید",
//         })
//         .positive({ message: "مقدار عددی مثبت وارد کنید" })
//       //.int({ message: "Value must be an integer" })
//     ),

//   name: z.string().optional(),
//   nov: z
//     .string({
//       required_error: "این فیلد اجباری است",
//     })
//     .min(1)
//     .max(2),
//   metraj: z
//     .number({
//       invalid_type_error: "مقدار عددی  وارد کنید",
//     })
//     .positive({ message: "مقدار عددی مثبت وارد کنید" })
//     .int({ message: "مقدار عددی  وارد کنید" })
//     .or(z.string())
//     .pipe(
//       z.coerce
//         .number({
//           invalid_type_error: "مقدار عددی  وارد کنید",
//         })
//         .positive({ message: "مقدار عددی مثبت وارد کنید" })
//       //.int({ message: "Value must be an integer" })
//     ),

//   bazar: z
//     .string({
//       required_error: "این فیلد اجباری است",
//     })
//     .min(1)
//     .max(2),
//   tabagh: z
//     .string({
//       required_error: "این فیلد اجباری است",
//     })
//     .min(1)
//     .max(2),
//   rahro: z
//     .string({
//       required_error: "این فیلد اجباری است",
//     })
//     .min(1)
//     .max(2),
//   tel1: z.string().optional(),
//   tel2: z.string().optional(),
//   cposti: z.string().optional(),
//   tahvil: z.string().optional(),
//   active: z.boolean().default(false).optional(),
//   checkgift: z.boolean().default(false).optional(),
//   checkrol: z.string().optional(),
//   tovzeh: z.string().optional(),
// });

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
] as const;
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;
export const AddEditStoreModal = ({
  mutation,
  bazar,
  rahro,
  nov,
  tabagh,
  data,
}: {
  mutation: () => void;
  bazar?: FilterOptions[];
  rahro?: FilterOptions[];
  nov?: FilterOptions[];
  tabagh?: FilterOptions[];
  data?: z.infer<typeof StoreSchema>;
}) => {
  const router = useRouter();
  const AddEditStoreModal = useAddEditStoreModal();
  const [isLoading, setIsLoading] = useState(false);
  // const { filters: _bazar } = useFilter({ filter: "bazar" });
  // const { filters: _tabagh } = useFilter({ filter: "tabagh" });
  // const { filters: _nov } = useFilter({ filter: "nov" });
  // const { filters: _rahro } = useFilter({ filter: "rahro" });
  // const [hooksCompleted, setHooksCompleted] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editstore, setEditstore] = useState<z.infer<typeof StoreSchema>>();
  const [tmp, setTmp] = useState(false);

  const [error, setError] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FieldValues>({
  //   defaultValues: {
  //     pelak: "a",
  //   },
  // });
  // console.log("AddEditStoreModal.editID>", AddEditStoreModal.editID);
  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: AddEditStoreModal.editID !== "" ? data : {},
    //   AddEditStoreModal.editID === "add"
    //     ? {}
    //     : async () => {
    //         //console.log("start");
    //         return await fetch("/api/store/" + AddEditStoreModal.editID).then(
    //           (res) => res.json()
    //         );
    //       },
  });

  // useEffect(() => {
  //   // Check if all hooks have completed, then trigger the useEffect.
  //   if (_bazar && _tabagh && _rahro && _nov) {
  //     setHooksCompleted(4);
  //     console.log("completed");
  //   }
  // }, [_bazar, _tabagh, _rahro, _nov]);

  useEffect(
    () => {
      // setTimeout(() => {
      //alert();
      // form.cle();
      // if (AddEditStoreModal.editID === "") form.reset();
      form.reset(data);
      // form.setValue("nov", editstore.nov?.toString());
      // form.setValue("tabagh", editstore.tabagh?.toString());
      // form.setValue("rahro", editstore.rahro?.toString());
      // form.setValue("bazar", editstore.bazar?.toString());
    },
    // }, 2000);
    [data, form]
  );

  // useEffect(() => {
  //   fetch(
  //     "/api/store/" +
  //       (AddEditStoreModal.editID !== "" ? AddEditStoreModal.editID : "1")
  //   ).then(async (res) => {
  //     //console.log(await res.json());
  //     setEditstore(await res.json());
  //   });
  // }, [AddEditStoreModal.editID]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (editstore) {
  //       console.log("amooo", editstore.nov);
  //       // form.reset(editstore);
  //     }
  //   }, 2220);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [editstore]);

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
          //** */ mutate(`/api/projects/${slug}/domains`);
          AddEditStoreModal.onClose();
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
          toast.error(res.statusText);
        }
      }, 3);
    });
  };

  const onToggle = useCallback(() => {
    AddEditStoreModal.onClose();
    //  registerModal.onOpen();
  }, [AddEditStoreModal]);

  const endpoint = useMemo(() => {
    if (AddEditStoreModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/store`,
        successMessage: "Successfully updated domain!",
      };
    } else {
      return {
        method: "POST",
        url: `/api/store`,
        successMessage: "Successfully added domain!",
      };
    }
  }, [AddEditStoreModal.editID]);

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-row gap-2 ">
          <FormField
            control={form.control}
            name="pelakCH"
            render={({ field }) => (
              <FormItem className="w-10">
                <FormLabel>پلاک :</FormLabel>
                <FormControl>
                  <Input
                    className=" text-slate-600 focus:ring-1 w-10 px-1 text-center uppercase"
                    disabled={isLoading || AddEditStoreModal.editID !== ""}
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pelakNU"
            render={({ field }) => (
              <FormItem>
                <FormLabel>.</FormLabel>
                <FormControl>
                  <Input
                    className=" text-slate-600 focus:ring-1 w-24"
                    disabled={isLoading || AddEditStoreModal.editID !== ""}
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="nov"
          render={({ field }) => (
            <FormItem>
              <div className=" flex flex-row justify-between">
                <FormLabel>نوع واحد :</FormLabel>
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
                  {nov?.map((item: FilterOptions) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>نام واحد :</FormLabel>
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
          name="metraj"
          render={({ field }) => (
            <FormItem className="">
              <div className=" flex flex-row justify-between">
                <FormLabel>مساحت :</FormLabel>
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
          name="bazar"
          render={({ field }) => (
            <FormItem>
              <div className=" flex flex-row justify-between">
                <FormLabel> بلوک :</FormLabel>
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
                  {bazar?.map((item: FilterOptions) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tabagh"
          render={({ field }) => (
            <FormItem>
              <div className=" flex flex-row justify-between">
                <FormLabel> تراز :</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  {tabagh?.map((item: FilterOptions) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rahro"
          render={({ field }) => (
            <FormItem>
              <div className=" flex flex-row justify-between">
                <FormLabel> راهرو :</FormLabel>

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
                  {rahro?.map((item: FilterOptions) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tel1"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel> تلفن اول واحد :</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tel2"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>تلفن دوم واحد :</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cposti"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel> کد پستی :</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Tahvil"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel> تاریخ تحویل :</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="ChekGift"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">جشنواره :</FormLabel>
                    {/* <FormDescription>
                      Receive emails about new products, features, and more.
                    </FormDescription> */}
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">وضعیت :</FormLabel>
                    <FormDescription>فعال / غیر فعال</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      // disabled
                      // aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="ChekRol"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>حقوقی :</FormLabel>
              <FormControl>
                <RadioGroup
                  /*
      // @ts-ignore */

                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex gap-2 items-center ltr:justify-start rtl:justify-end">
                    <FormLabel className="font-normal">بلی</FormLabel>

                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex items-center gap-2   ltr:justify-start rtl:justify-end">
                    <FormLabel className="font-normal">خیر</FormLabel>

                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tovzeh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات :</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="توضیحات"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Checkbox {...register("maghta")}></Checkbox> */}

        {/* <Button
          className="h-9 w-full rounded-md border border-black bg-black px-6 text-sm text-white transition-all duration-150 ease-in-out hover:bg-white hover:text-black focus:outline-none sm:w-auto"
          disabled={isLoading}
          type="submit"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button> */}
        <div>{error}</div>
      </form>
    </Form>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  // if (hooksCompleted !== 4) return null;
  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddEditStoreModal.isOpen}
      title={AddEditStoreModal.editID}
      // "افزودن واحد"
      actionLabel={AddEditStoreModal.editID === "" ? "افزودن" : "ویرایش"}
      secondaryActionLabel="انصراف"
      secondaryAction={AddEditStoreModal.onClose}
      onClose={AddEditStoreModal.onClose}
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Modaltall from "./Modaltall";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import useFilter from "@/lib/hooks/useFilter";
import { toast } from "sonner";
import { StoreSchema } from "@/lib/schemas";
import { mutate } from "swr";

interface AddEditStoreModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAddEditStoreModal = create<AddEditStoreModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddEditStoreModal;
