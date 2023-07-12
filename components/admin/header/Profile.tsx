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
type Props = {};

export default function Profile({}: Props) {
  // const { status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });

  const loginModal = useLoginModal();
  return (
    <div>
      <LoginModal></LoginModal>
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
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>SignOut</DropdownMenuItem>
          <DropdownMenuItem onClick={() => loginModal.onOpen()}>
            Login
          </DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
