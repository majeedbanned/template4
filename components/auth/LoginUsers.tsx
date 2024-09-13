"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
//import { toast } from "react-hot-toast";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  username: z
    .string({
      required_error: "لطفا نام کاربری را وارد کنید",
    })
    .min(1, { message: "لطفا نام کاربری را وارد کنید" })
    .max(50),
  password: z
    .string()
    .min(1, { message: "لطفا کلمه عبور را وارد کنید" })
    .max(50),
});

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// import Input from "../inputs/Input";

const LoginUsers = () => {
  //   const registerModal = useRegisterModal();
  //   const loginModal = useLoginModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const { data: session } = useSession();
  // console.log("Session: ", session);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //   const onToggle = useCallback(() => {
  //     registerModal.onClose();
  //     loginModal.onOpen();
  //   }, [registerModal, loginModal])

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //   console.log(values);
    //return;
    setIsLoading(true);
    setError("");
    signIn("credentials", {
      ...values,
      redirect: false,
      type: "user",
      //callbackUrl: "/admin/main22",
    })
      .then((callback) => {
        //  return;
        setIsLoading(false);
        //  console.log(callback);
        if (callback?.ok) {
          //console.log(callback);
          // return;
          //redirect("/admin/main");
          //  toast.success('Logged in');
          //  router.refresh();
          //**** */  router.push("/admin/dashboard");
          router.push("/admin/bill");
          // loginModal.onClose();
        }

        if (callback?.error) {
          //    console.log(callback);
          //setError(callback?.error);
          setError("نام کاربری یا کلمه عبور اشتباه است");

          setIsLoading(false);
          //  toast.error(callback.error);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sm:space-y-8 border-red-100"
      >
        <span className="border-1 font-semibold text-center text-2xl">
          سامانه پرداخت شارژ مجتمع خلیج فارس
        </span>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <motion.div
                className="border-0"
                key={1}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                // transition={{ duration: 0.2 }}
              >
                <div className="flex flex-row  justify-end">
                  <FormMessage className=" space-y-0 mr-auto mt-1 " />
                  <FormLabel className="flex justify-end p-2  text-slate-600 ">
                    : نام کاربری{" "}
                  </FormLabel>
                </div>
                <FormControl className="border">
                  <Input
                    className="focus:ring-0 text-center rounded-3xl w-[290px] "
                    disabled={isLoading}
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
              </motion.div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <motion.div
                className="border-0"
                key={1}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <div className="flex flex-row  justify-end">
                  <FormMessage className=" space-y-0 mr-auto mt-1 " />

                  <FormLabel className="flex justify-end p-2  text-slate-600 ">
                    : کلمه عبور{" "}
                  </FormLabel>
                </div>

                <FormControl>
                  <Input
                    type="password"
                    className="focus:ring-0 text-center rounded-3xl  w-[290px] "
                    disabled={isLoading}
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
              </motion.div>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <motion.div
            className="flex flex-col gap-4 border-0"
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button
              className="h-9 mt-4  w-[250px] border-0  bg-[#20c9dc] shadow-lg shadow-[#ff9901]/30 rounded-3xl px-2 text-sm text-white transition-all duration-150 ease-in-out hover:bg-[#29e5ec]  focus:outline-none "
              disabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ورود
            </Button>
            <span className="text-sm text-slate-500">فراموشی کلمه عبور</span>
          </motion.div>
        </div>
        <div className="text-sm text-red-400">{error}</div>
      </form>
    </Form>
  );
};

export default LoginUsers;
