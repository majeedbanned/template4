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
import { useRouter } from "next/navigation";

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
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// import Input from "../inputs/Input";

const Login = () => {
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
    console.log(values);
    //return;
    setIsLoading(true);
    setError("");
    signIn("credentials", {
      ...values,
      redirect: true,
      callbackUrl: "/admin/dashboard",
    }).then((callback) => {
      setIsLoading(false);
      console.log(callback);
      if (callback?.ok) {
        // redirect("/admin/dashboard");
        //  toast.success('Logged in');
        //  router.refresh();
        //**** */  router.push("/admin/dashboard");
        // router.replace("/profile");
        // loginModal.onClose();
      }

      if (callback?.error) {
        setError(callback?.error);
        setIsLoading(false);
        //  toast.error(callback.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="focus:ring-1"
                  disabled={isLoading}
                  placeholder="shadcn"
                  {...field}
                />
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="shadcn" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="h-9 w-full rounded-md border border-black bg-black px-6 text-sm text-white transition-all duration-150 ease-in-out hover:bg-white hover:text-black focus:outline-none sm:w-auto"
          disabled={isLoading}
          type="submit"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
        <div>{error}</div>
      </form>
    </Form>
  );
};

export default Login;
