"use client";

import { useCallback, useState } from "react";
//import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

//import useRegisterModal from "@/app/hooks/useRegisterModal";
//import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
// import Input from "../inputs/Input";
// import Heading from "../Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Button from "../Button";

export const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  //   const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        // toast.success("Logged in");
        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        // toast.error(callback.error);
      }
    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    //  registerModal.onOpen();
  }, [loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div>Login to your account!</div>
      <Label>Email</Label>
      <Input
        id="email"
        disabled={isLoading}
        // register={register}
        // errors={errors}
        required
      ></Input>
      <Label>Password</Label>

      <Input
        id="password"
        type="password"
        disabled={isLoading}
        // register={register}
        // errors={errors}
        required
      ></Input>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* icon={FcGoogle} */}
      <Button onClick={() => signIn("google")}>Continue with Google</Button>
      {/* icon={AiFillGithub}  */}
      <Button onClick={() => signIn("github")}>Continue with Github</Button>
      <div
        className="
      text-neutral-500 text-center mt-4 font-light"
      >
        <p>
          First time using Airbnb?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      secondaryActionLabel="Cancel"
      secondaryAction={loginModal.onClose}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      description="This action cannot be undone. This will permanently delete your account
      and remove your data from our servers."
    />
  );
};

import { create } from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useLoginModal;
