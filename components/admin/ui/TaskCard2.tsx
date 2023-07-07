import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import banner from "@/public/images/banner.jpeg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  ListChecks,
  MessageCircle,
  PlusIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type Props = {};

export default function TaskCard2({}: Props) {
  return (
    <Card className="flex dark:bg-[#121415] border-0 p-4 gap-2 flex-col rounded-2xl shadow-md justify-start   h-auto">
      <div className="  w-full  flex flex-row gap-2 ">
        <Button
          variant={"outline"}
          className="border-blue-500  hover:text-blue-600 rounded-full h-6 px-2 text-blue-500"
        >
          <span className="text-[13px] font-semibold ">Discussion</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="ltr:ml-auto rtl:mr-auto">
            <Button
              variant={"outline"}
              className="border-gray-500 ltr:ml-auto rtl:mr-auto  hover:text-gray-600 rounded-full h-6 px-2 text-gray-500"
            >
              <span className="text-[13px] font-semibold ">+ Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-[20px]">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
              <ClipboardCheck className="text-gray-500 w-5 h-5 "></ClipboardCheck>
              <span className="font-semibold text-gray-500">Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
              <ListChecks className="text-gray-500 w-5 h-5 "></ListChecks>
              <span className="font-semibold text-gray-500">Sub Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
              <CalendarClock className=" text-gray-500 w-5 h-5 "></CalendarClock>
              <span className="font-semibold text-gray-500">Event</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
              <Bell className="text-gray-500 w-5 h-5 "></Bell>
              <span className="font-semibold text-gray-500">Alarm</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="font-semibold text-lg text-gray-800 dark:text-white">
        Discussing the design with the customer
      </div>
      <div>
        <div className="py-4">
          <Image
            className="rounded-xl"
            src={banner}
            alt=""
            width={400}
            height={350}
          ></Image>
        </div>
      </div>
      <div>
        <Separator className="my-3 border-0"></Separator>

        <div className="flex items-center gap-2">
          <div className="flex flex-row -space-x-4 ">
            <Avatar className="border-[3px]  border-white dark:border-[#0f172b]">
              <AvatarImage src="https://i.pravatar.cc/301" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="border-[3px]   border-white dark:border-[#0f172b]">
              <AvatarImage src="https://i.pravatar.cc/300" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="border-[3px]   border-white dark:border-[#0f172b]">
              <AvatarImage src="https://i.pravatar.cc/302" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          {/* <div className="flex -space-x-1 overflow-hidden">
            <Image
              width={15}
              height={15}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <Image
              width={15}
              height={15}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <Image
              width={20}
              height={15}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt=""
            />
          </div> */}

          <Button className="rounded-full w-6 shadow-md shadow-blue-500 h-6 p-0  bg-blue-500 flex justify-center  items-center">
            <PlusIcon className="w-2 h-2 text-white"></PlusIcon>
          </Button>
          <span className="text-blue-500">invite</span>
          <Button
            variant={"secondary"}
            className="border-green-500 ltr:ml-auto rtl:mr-auto  hover:text-gray-600 rounded-full h-7 px-2 text-gray-500"
          >
            <Calendar className="w-4 h4"></Calendar>
            <span className="text-[13px] font-semibold ">22.4.23 16:30</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
