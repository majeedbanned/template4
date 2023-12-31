import React from "react";
import { Input } from "@/components/ui/input";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
type Props = {};

export default function Search({}: Props) {
  return (
    <div className="px-4 hidden lg:inline-flex py-0 h-10  gap-2 justify-center items-center dark:bg-[#2b2e31] bg-[#f1f5f9] rounded-full">
      <MicrophoneIcon className="w-6 h-6 text-blue-600"></MicrophoneIcon>

      <Input
        className="h-8 border-0 bg-transparent"
        type="search"
        placeholder="Search"
      />
      <MagnifyingGlassIcon className="w-6 h-6 text-slate-400"></MagnifyingGlassIcon>
    </div>
  );
}
