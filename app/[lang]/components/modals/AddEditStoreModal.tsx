"use client";

import { useCallback, useState } from "react";
//import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FilterOptions } from "@/lib/types";

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
const formSchema = z.object({
  pelakCH: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(1, { message: "*" })
    .max(1, { message: "*" }),
  pelakNU: z.coerce.number({
    required_error: "فیلد اجباری",
    invalid_type_error: " لطفا بصورت عددی وارد نمایید",
  }),

  name: z.string().optional(),
  nov: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1)
    .max(2),
  metraj: z.coerce.number({
    required_error: "فیلد اجباری",
    invalid_type_error: " لطفا بصورت عددی وارد نمایید",
  }),
  bazar: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1)
    .max(2),
  tabagh: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1)
    .max(2),
  rahro: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1)
    .max(2),
  tel1: z.string().optional(),
  tel2: z.string().optional(),
  cposti: z.string().optional(),
  tahvil: z.string().optional(),
  active: z.boolean().default(false).optional(),
  checkgift: z.boolean().default(false).optional(),
  checkrol: z.string().optional(),
  tovzeh: z.string().optional(),

  rooztavalod: z.boolean().default(false).optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
  language: z.string({
    required_error: "Please select a language.",
  }),
  ReactDatepicker: z.string().min(2).max(50),
  // pass: z.string().min(2).max(50),
  // rooztavalod: z.string(),
  // school_code: z.string().min(2).max(50),
  // maghta: z.number(),
  // domdom: z.string().url(),
});

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
export const AddEditStoreModal = () => {
  const router = useRouter();
  const AddUserModal = useAddEditStoreModal();
  const [isLoading, setIsLoading] = useState(false);
  const { filters: _bazar } = useFilter({ filter: "bazar" });
  const { filters: _tabagh } = useFilter({ filter: "tabagh" });
  const { filters: _nov } = useFilter({ filter: "nov" });

  const { filters: _rahro } = useFilter({ filter: "rahro" });

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      items: ["recents", "home"],
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pelakCH: "",
      pelakNU: 0,

      name: "",
      items: ["recents", "home"],
      security_emails: true,
      // pass: "",
      // rooztavalod: "1",
      // school_code: "",
      // maghta: 1,
      // domdom: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    return;
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        // toast.success("Logged in");
        router.refresh();
        AddUserModal.onClose();
      }

      if (callback?.error) {
        // toast.error(callback.error);
      }
    });
  };

  const onToggle = useCallback(() => {
    AddUserModal.onClose();
    //  registerModal.onOpen();
  }, [AddUserModal]);

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  {_nov?.map((item: FilterOptions) => (
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
                  {_bazar?.map((item: FilterOptions) => (
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
                  {_tabagh?.map((item: FilterOptions) => (
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
                  {_rahro?.map((item: FilterOptions) => (
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
          name="tahvil"
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
              name="checkgift"
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
          name="checkrol"
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
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex items-center gap-2   ltr:justify-start rtl:justify-end">
                    <FormLabel className="font-normal">خیر</FormLabel>

                    <FormControl>
                      <RadioGroupItem value="none" />
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

  return (
    <Modaltall
      disabled={isLoading}
      isOpen={AddUserModal.isOpen}
      title={AddUserModal.editID}
      // "افزودن واحد"
      actionLabel="افزودن"
      secondaryActionLabel="انصراف"
      secondaryAction={AddUserModal.onClose}
      onClose={AddUserModal.onClose}
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
