"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Divide, Settings2, SettingsIcon } from "lucide-react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import Profile from "./header/Profile";
import Notifications from "./header/Notifications";
import Chat from "./header/Chat";
import Search from "./header/Search";
import Projects from "./header/Projects";
import LangSelect from "./header/LangSelect";
type Props = {};

export default function AdminHeader({}: Props) {
  const { data: session } = useSession();
  console.log("sessionnn>>", session);

  return (
    <div className="flex flex-row flex-1 ">
      <div className="basis-1/2">
        <Projects></Projects>
      </div>
      <div className="basis-1/2 flex justify-end  gap-2">
        <Search></Search>
        <LangSelect></LangSelect>

        <Chat></Chat>
        <Notifications></Notifications>
        <Profile></Profile>
      </div>
    </div>
  );
  // return (
  //   <div   className="flex flex-row">
  //     <Dialog>
  //       <DialogTrigger asChild>
  //         <Button variant="outline">Edit Profile</Button>
  //       </DialogTrigger>
  //       <DialogContent className="sm:max-w-[425px]">
  //         <DialogHeader>
  //           <DialogTitle>Edit profile</DialogTitle>
  //           <DialogDescription>
  //             Make changes to your profile here. Click save when you're done.
  //           </DialogDescription>
  //         </DialogHeader>
  //         <div className="grid gap-4 py-4">
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <p htmlFor="name" className="text-right">
  //               Name
  //             </p>
  //             <input id="name" value="Pedro Duarte" className="col-span-3" />
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <p htmlFor="username" className="text-right">
  //               Username
  //             </p>
  //             <input id="username" value="@peduarte" className="col-span-3" />
  //           </div>
  //         </div>
  //         <DialogFooter>
  //           <Button type="submit">Save changes</Button>
  //         </DialogFooter>
  //       </DialogContent>
  //     </Dialog>
  //     <Select>
  //       <SelectTrigger className="w-[180px] rounded-[25px]">
  //         <SelectValue placeholder="Select a fruit" />
  //       </SelectTrigger>
  //       <SelectContent className="rounded-[20px]">
  //         <SelectGroup>
  //           <SelectLabel>Fruits</SelectLabel>
  //           <SelectItem className="rounded-[25px]" value="apple">
  //             Apple
  //           </SelectItem>
  //           <SelectItem value="banana">Banana</SelectItem>
  //           <SelectItem value="blueberry">Blueberry</SelectItem>
  //           <SelectItem value="grapes">Grapes</SelectItem>
  //           <SelectItem value="pineapple">Pineapple</SelectItem>
  //         </SelectGroup>
  //       </SelectContent>
  //     </Select>
  //   </div>
  // );
}
