import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDaysIcon,
  PencilSquareIcon,
  Square2StackIcon,
  Squares2X2Icon,
  TableCellsIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  AlarmClock,
  Bell,
  CheckCheckIcon,
  CheckCircle2,
  Dot,
  FilterIcon,
  ListFilter,
  UserPlus,
  UserPlus2,
} from "lucide-react";
import React from "react";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import TabView from "@/components/admin/ui/TabView";
import TaskCard from "@/components/admin/ui/TaskCard";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipboardCheck } from "lucide-react";
import { ListChecks } from "lucide-react";
import { CalendarClock } from "lucide-react";
import TaskCard2 from "@/components/admin/ui/TaskCard2";
import TaskCard3 from "@/components/admin/ui/TaskCard3";
import TaskCard6 from "@/components/admin/ui/TaskCard6";
import { PageWrapper } from "../../components/PageWrapper";

type Props = {};

export default function Dashboard({}: Props) {
  return (
    <PageWrapper className="">
      <div className="font-sans flex flex-row justify-between font-light  p-2  ">
        <div className="">
          Project MT / Comercial Projects / Team Phonix
          <h1 className="text-2xl font-bold mt-2 text-gray-700 dark:text-white">
            Creating an application for dero.com
          </h1>
        </div>
        <div className="flex   flex-row gap-1 items-center  h-8 ">
          <CalendarDaysIcon className="w-6 h-6 text-gray-400"></CalendarDaysIcon>
          <div className="flex flex-col">
            <p className="font-light whitespace-nowrap text-[10px] sm:text-sm text-gray-400">
              Creation Date
            </p>
            <p className="text-[12px] whitespace-nowrap -mt-1 font-semibold">
              17-10-2022
            </p>
          </div>
          <Separator orientation="vertical"></Separator>
          <PencilSquareIcon className="w-6 cursor-pointer h-6"></PencilSquareIcon>
        </div>
      </div>

      <div className="sm:my-6 my-4 p-2 gap-2 flex flex-wrap  flex-row items-center">
        <span className="font-bold text-sm">All Team Members:</span>
        <span className="text-blue-500 font-bold mx-1">12</span>
        <div className="flex flex-row -space-x-4">
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
          <Avatar className="border-[3px]   border-white dark:border-[#0f172b]">
            <AvatarImage src="https://i.pravatar.cc/303" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="border-[3px]  border-white  dark:border-[#0f172b]">
            <AvatarImage src="https://i.pravatar.cc/304" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="border-[3px]   border-white dark:border-[#0f172b]">
            <AvatarImage src="https://i.pravatar.cc/305" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <Button className="rounded-full h-9 space-x-2" variant={"outline"}>
          <UserPlus2 className="w-6 h-6 font-bold text-blue-500" />
          <span className=" text-blue-500 font-semibold">invite</span>
        </Button>

        <Select>
          <SelectTrigger className=" ltr:ml-auto rtl:mr-auto w-[110px] rounded-[25px]">
            <FilterIcon className="w-4 h-4 text-gray-500"></FilterIcon>

            <SelectValue
              className="font-semibold text-gray-50"
              placeholder="Filter"
            />
          </SelectTrigger>
          <SelectContent className="rounded-[20px]">
            <SelectGroup>
              <SelectLabel className="font-semibold text-[#6d93ec]">
                Your work
              </SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">To do</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="  w-[110px] rounded-[25px]">
            <ListFilter className="w-4 h-4 text-gray-500"></ListFilter>

            <SelectValue
              className="font-semibold text-gray-50"
              placeholder="Filter"
            />
          </SelectTrigger>
          <SelectContent className="rounded-[20px]">
            <SelectGroup>
              <SelectLabel className="font-semibold text-[#6d93ec]">
                Your work
              </SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">To do</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* <div className="ml-auto border"> */}
        <TabView></TabView>
        {/* </div> */}
      </div>

      <Card className="p-3 lg:p-6 flex-grow h-auto flex-col rounded-[25px] bg-[#eef2f5] dark:bg-[#2b2e31] border-0  justify-center items-start ">
        {/* <div className=" p-4 mx-8 my-4 flex justify-start items-center border-b ">
          header
        </div> */}
        <div className="flex flex-row flex-wrap gap-4  justify-start items-start ">
          <div className="flex-1  flex flex-col ">
            {/* header */}
            <div className="flex flex-row gap-4 items-center">
              <Button
                className="shadow-md shadow-green-300/30 bg-gradient-to-b h-6 rounded-full from-[#8ae9a6]/70 to-[#31c97d]/70"
                variant={"ghost"}
              >
                <span className="text-white text-[12px]">New</span>
              </Button>

              <span className="text-gray-400 text-sm flex flex-row gap-1  font-semibold">
                <CheckCircle2 className="w-4 h-4 text-gray-400"></CheckCircle2>8
                Tasks
              </span>

              <span className="text-gray-400 flex flex-row gap-1 text-sm font-semibold">
                <AlarmClock className="w-4 h-4 text-gray-400"></AlarmClock>
                231 Hours
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="ltr:ml-auto rtl:mr-auto">
                  <Button
                    className="  w-6  h-4 rounded-md ltr:ml-auto rtl:mr-auto bg-[#e4e7ea]"
                    variant={"ghost"}
                  >
                    <span className="text-gray-500 text-2xl pb-3  font-bold">
                      ..
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[20px]">
                  <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
                    <ClipboardCheck className="text-gray-500 w-5 h-5 "></ClipboardCheck>
                    <span className="font-semibold text-gray-500">Task</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex ltr:flex-row rtl:flex-row-reverse gap-2 ">
                    <ListChecks className="text-gray-500 w-5 h-5 "></ListChecks>
                    <span className="font-semibold text-gray-500">
                      Sub Task
                    </span>
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
            <Separator className="my-4"></Separator>
            <div>
              <TaskCard></TaskCard>
            </div>
          </div>

          <div className="flex-1  flex flex-col ">
            {/* header */}
            <div className="flex flex-row gap-4 items-center">
              <Button
                className="shadow-md flex-nowrap shadow-[#db7db7]/30 bg-gradient-to-b h-6 w-24 p-1 rounded-full from-[#c977a9]/70 to-[#ab307b]/70"
                variant={"ghost"}
              >
                <span className="text-white text-[11px]  flex-nowrap">
                  in progress
                </span>
              </Button>

              <span className="text-gray-400 text-sm flex flex-row gap-1  font-semibold">
                <CheckCircle2 className="w-4 h-4 text-gray-400"></CheckCircle2>
                14 Tasks
              </span>

              <span className="text-gray-400 flex flex-row gap-1 text-sm font-semibold">
                <AlarmClock className="w-4 h-4 text-gray-400"></AlarmClock>
                284 Hours
              </span>
              <Button
                className="  w-6  h-4 rounded-md ltr:ml-auto rtl:mr-auto bg-[#e4e7ea]"
                variant={"ghost"}
              >
                {/* <Dot className="w-6 h-6 text-red-400"></Dot> */}
                <span className="text-gray-500 text-2xl pb-3  font-bold">
                  ..
                </span>
              </Button>
            </div>
            <Separator className="my-4"></Separator>
            <div>
              <TaskCard2></TaskCard2>
            </div>
          </div>

          <div className="flex-1  flex flex-col ">
            {/* header */}
            <div className="flex flex-row gap-4 items-center">
              <Button
                className="shadow-md shadow-[#5d8b9f]/30 bg-gradient-to-b h-6 rounded-full from-[#5d8b9f]/70 to-[#5d8b9f]/70"
                variant={"ghost"}
              >
                <span className="text-white text-[12px]">Personal</span>
              </Button>

              <span className="text-gray-400 text-sm flex flex-row gap-1  font-semibold">
                <CheckCircle2 className="w-4 h-4 text-gray-400"></CheckCircle2>6
                Tasks
              </span>

              <span className="text-gray-400 flex flex-row gap-1 text-sm font-semibold">
                <AlarmClock className="w-4 h-4 text-gray-400"></AlarmClock>
                129 Hours
              </span>
              <Button
                className="  w-6  h-4 rounded-md ltr:ml-auto rtl:mr-auto bg-[#e4e7ea]"
                variant={"ghost"}
              >
                {/* <Dot className="w-6 h-6 text-red-400"></Dot> */}
                <span className="text-gray-500 text-2xl pb-3  font-bold">
                  ..
                </span>
              </Button>
            </div>
            <Separator className="my-4"></Separator>
            <div className="flex flex-col gap-4">
              <TaskCard3></TaskCard3>
              <TaskCard6></TaskCard6>
            </div>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}
