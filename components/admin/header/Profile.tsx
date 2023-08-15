"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { redirect } from "next/navigation";
import { SettingsIcon, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
// import useLoginModal from "@/app/hooks/useLoginModal";
import useLoginModal, {
  LoginModal,
} from "@/app/[lang]/components/modals/LoginModal";
import { Toaster, toast } from "sonner";
import { Session } from "next-auth/core/types";
import {
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
type Props = {};

export default function Profile({ cu }: { cu?: Session | null }) {
  const { data: session, status } = useSession();
  // const { status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const loginModal = useLoginModal();

  const promiseToast = () => {
    const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        return `${data} toast has been added`;
      },
      error: "Error",
    });
  };
  return (
    <div>
      <LoginModal></LoginModal>
      <Toaster></Toaster>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            className="border-0 p-3 rounded-full w-10 h-10"
            variant="secondary"
          >
            <Avatar className="border">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-[20px]">
          <DropdownMenuLabel className="flex justify-end">
            {cu?.user.name + " " + cu?.user.lname}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-end">
            پروفایل کاربر
            <UserCircleIcon className="w-4 h-4"></UserCircleIcon>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={promiseToast}>
            Tost Promise
          </DropdownMenuItem> */}

          <DropdownMenuItem
            className="flex justify-end"
            onClick={() => {
              toast.message("Signing Out", {
                description: "Please wait...",
              });
              signOut();
            }}
          >
            خروج
            <ArrowRightOnRectangleIcon className="w-4 h-4"></ArrowRightOnRectangleIcon>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => loginModal.onOpen()}>
            Login
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem
            onClick={() =>
              toast.message("Event has been created", {
                description: "Monday, January 3rd at 6:00pm",
              })
            }
          >
            Toast
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
