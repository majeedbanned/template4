import React from "react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsIcon } from "lucide-react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
type Props = {};

export default function Chat({}: Props) {
  return (
    <div>
      {/* <Button
        className="relative border-0 p-2 m-0 rounded-full w-10 h-10 "
        variant="secondary"
      >
        <ChatBubbleLeftRightIcon className="text-slate-600" fontSize={32} />
        <div
          className="absolute w-2 h-2 bg-green-400  rounded-full
            top-0 right-1"
        ></div>
      </Button> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            className="relative border-0 p-2 m-0 rounded-full w-10 h-10 "
            variant="secondary"
          >
            <ChatBubbleLeftRightIcon className="text-slate-600" fontSize={32} />
            <div
              className="absolute w-2 h-2 bg-green-400  rounded-full
            top-0 right-1"
            ></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-[20px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
