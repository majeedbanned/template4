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
  CheckCircle,
  ClipboardCheck,
  Clock,
  ListChecks,
  MessageCircle,
  PlusIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type Props = {};

export default function TaskCard3({}: Props) {
  return (
    <Card className="flex dark:bg-[#121415] border-0 p-4 gap-2 flex-col rounded-2xl shadow-md justify-start   h-auto">
      <div className="  w-full  flex flex-row gap-2 ">
        <Button
          variant={"outline"}
          className="border-orange-500  hover:text-orange-600 rounded-full h-6 px-2 text-orange-500"
        >
          <span className="text-[13px] font-semibold ">Design system</span>
        </Button>
        <Button
          variant={"outline"}
          className="border-pink-500  hover:text-pink-600 rounded-full h-6 px-2 text-pink-500"
        >
          <span className="text-[13px] font-semibold ">Ui kit</span>
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
        Design for app
      </div>
      <div>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          Development of the concept and style the collection of the wiseboard,
          an analysis oshe niche ana compenors
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

          <Button
            variant={"secondary"}
            className="border-green-500 ltr:ml-auto rtl:mr-auto  hover:text-gray-600 rounded-full h-7 px-2 text-gray-500"
          >
            <CheckCircle className="w-4 h4"></CheckCircle>
            <span className="text-[13px] font-semibold ">12 Tasks</span>
          </Button>
          <Button
            variant={"secondary"}
            className="border-green-500   hover:text-slate-500 rounded-full h-7 px-2 text-slate-500"
          >
            <Clock className="w-4 h4"></Clock>
            <span className="text-[13px] font-semibold ">127 Hours</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
