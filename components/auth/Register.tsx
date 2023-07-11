"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
//import { toast } from "react-hot-toast";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

// import Input from "../inputs/Input";

const Register = () => {
  //   const registerModal = useRegisterModal();
  //   const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    //return;
    setIsLoading(true);

    axios
      .post("/api/register", values)
      .then((data) => {
        setError(JSON.stringify(data));
        console.log(data);
        //  toast.success("Registered!");
        // registerModal.onClose();
        // loginModal.onOpen();
      })
      .catch((error) => {
        setError(JSON.stringify(error));

        //  toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="border w-[450px] mt-12 flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col items-center justify-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username1</FormLabel>
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
          <Button type="submit">Register</Button>
          {isLoading && <div>please wait...</div>}
          <div>{error}</div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
