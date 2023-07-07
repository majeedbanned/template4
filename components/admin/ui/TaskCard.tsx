import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
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
  CalendarClock,
  ClipboardCheck,
  ListChecks,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {};

export default function TaskCard({}: Props) {
  return (
    <Card className="flex dark:bg-[#121415] border-0 p-4 gap-2 flex-col rounded-2xl shadow-md justify-start   h-auto">
      <div className="  w-full  flex flex-row gap-2 ">
        <Button
          variant={"outline"}
          className="border-purple-500  hover:text-purple-600 rounded-full h-6 px-2 text-purple-500"
        >
          <span className="text-[13px] font-semibold ">Task list</span>
        </Button>
        <Button
          variant={"outline"}
          className="border-green-500  hover:text-green-600 rounded-full h-6 px-2 text-green-500"
        >
          <span className="text-[13px] font-semibold ">Personal</span>
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
        List of tasks to start the project
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <Card className="p-2 px-6 border-0 dark:bg-[#1e1f21] bg-[#f7f8fa] text-sm text-gray-500 dark:text-white">
            resoonsible
            <Separator className="my-1"></Separator>
            <div className="flex flex-row items-center gap2">
              <Avatar className="border-[3px]  border-white dark:border-[#0f172b]">
                <AvatarImage src="https://i.pravatar.cc/301" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-blue-500 uppercase">Michel Dorian</span>
            </div>
          </Card>
          <Card className=" relative p-2 w-20 border-0 dark:bg-[#1e1f21] bg-[#f7f8fa] text-sm text-gray-500 dark:text-white">
            <div className="rounded-full w-2 h-2 bg-pink-600 shadow-md -top-1 right-1 absolute shadow-pink-500"></div>
            <span>Tasks</span>
            <Separator className="my-1"></Separator>
            <span className="text-2xl">24</span>
          </Card>
        </div>
        <div className="py-4">
          <RadioGroup className="flex flex-col " defaultValue="comfortable">
            <div className="flex rtl:flex-row-reverse ltr:flex-row  items-center gap-2">
              <RadioGroupItem value="default" id="r1" />
              <Label className="text-gray-500 line-through" htmlFor="r1">
                Make a buisness plan
              </Label>
            </div>
            <div className="flex rtl:flex-row-reverse ltr:flex-row  items-center gap-2">
              <RadioGroupItem value="default1" id="r2" />
              <Label className="text-gray-500 line-through" htmlFor="r2">
                Find a programer
              </Label>
            </div>
            <div className="flex rtl:flex-row-reverse ltr:flex-row  items-center gap-2">
              <RadioGroupItem value="default2" id="r3" />
              <Label className="text-pink-500" htmlFor="r3">
                find an accountant
              </Label>
            </div>

            <div className="flex rtl:flex-row-reverse ltr:flex-row  items-center gap-2">
              <RadioGroupItem disabled value="default4" id="r4" />
              <Label className="text-gray-500 " htmlFor="r4">
                pass the plan for approval
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div>
        <Separator className="my-3 border-0"></Separator>

        <div className="flex items-center justify-between">
          <Select>
            <SelectTrigger className="border-0 px-0 font-semibold w-[90px] rounded-[25px]">
              <SelectValue className="font-semibold" placeholder="Your work" />
            </SelectTrigger>
            <SelectContent className="rounded-[20px]">
              <SelectGroup>
                <SelectLabel className="font-semibold text-[#6d93ec]">
                  Your work
                </SelectLabel>
                <SelectItem
                  className="ltr:bg-red-300 rtl:bg-green-300"
                  value="apple"
                >
                  Project 1
                </SelectItem>
                <SelectItem value="banana">Project 2</SelectItem>
                <SelectItem value="blueberry">Project 3</SelectItem>
                <SelectItem value="grapes">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant={"secondary"}
            className="border-green-500  hover:text-purple-600 rounded-full h-7 px-2 text-purple-500"
          >
            <MessageCircle className="w-4 h4"></MessageCircle>
            <span className="text-[13px] font-semibold ">19 comments</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
