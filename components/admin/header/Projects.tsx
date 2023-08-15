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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
import logo from "@/public/images/logo.png";
import Image from "next/image";
type Props = {};

export default function Projects({}: Props) {
  return (
    <div className="flex flex-row gap-2">
      <Image src={logo} width={200} height={200} alt="logo"></Image>
      {/* <div className="hidden gap-2 md:inline-flex">
 <Select>
          <SelectTrigger className=" font-semibold w-[130px] rounded-[25px]">
            <SelectValue className="font-semibold" placeholder="Your work" />
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
          <SelectTrigger className="w-[130px] rounded-[25px]">
            <SelectValue placeholder="Dashboard" />
          </SelectTrigger>
          <SelectContent className="rounded-[20px]">
            <SelectGroup>
              <SelectLabel>Dashboard</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">To do</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="relative border-0 p-2 shadow-lg shadow-[#6d93ec]/50 px-4 bg-[#6d93ec] rounded-full  h-9 "
        variant="secondary"
      > 
        <PlusIcon className=" w-4 h-4 text-white font-bold" fontSize={32} />
        <Separator orientation="vertical" className="mx-2 text-white" />
        <p className="font-semibold  text-white">Create</p>
      </Button>*/}
    </div>
  );
}
