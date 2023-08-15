"use client";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  TvIcon,
  MessageCircle,
} from "lucide-react";
import logo from "@/public/images/logo.png";

import Link from "next/link";
import { useContext, createContext, useState, ReactNode } from "react";
import { motion } from "framer-motion";
const SidebarContext = createContext({ expanded: false });
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

export default function Sidebar({
  onExpand,
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
  onExpand: (id: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const icons = {
    TvIcon: TvIcon,
    MessageCircle: MessageCircle,
  };
  return (
    <aside className="h-screen hidden sm:inline-flex rounded-[15px] dark:bg-[#2b2e31] bg-[#eef2f5] sm:mt-2 sm:mx-4">
      <nav className="h-full flex flex-col  shadow-sm">
        <div className="p-3  pb-1 flex justify-between items-center">
          {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          /> */}

          <Image
            className={`overflow-hidden transition-all ${
              expanded ? "w-44" : "w-0"
            }`}
            src={logo}
            width={200}
            height={200}
            alt=""
          ></Image>
          <button
            onClick={() => {
              onExpand(!expanded);
              setExpanded((curr) => !curr);
            }}
            className="px-4 py-2  rounded-lg bg-gray-50 dark:bg-[#121415]  hover:bg-gray-200"
          >
            {expanded ? (
              <ChevronLast className="dark:text-gray-200 " />
            ) : (
              <ChevronFirst className="dark:text-gray-200" />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          {/* <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          /> */}
          {/* <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-44 ml-3" : "w-0"}
          `}
          > */}
          {/* <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div> */}
          {/* <MoreVertical size={20} /> */}
          {/* </div> */}
        </div>
      </nav>
    </aside>
  );
}

interface MenuItemProps {
  title: string;
  link: string;
  icon: ReactNode;
  active: boolean;
  selected: boolean;
  onClick: () => void;
}
export function MenuItem({
  title,
  link,
  icon,
  active,
  onClick,
  selected,
}: MenuItemProps) {
  return (
    <div>
      <Link
        // key={sub.id}
        className={`${
          selected ? "bg-orange-400/10  hover:bg-orange-400/10" : ""
        } relative  hover:dark:bg-[#2b2e31] gap-2 hover:bg-slate-100 my-1 rounded-lg items-center p-2 flex`}
        // className="relative  hover:dark:bg-[#2b2e31] gap-2 hover:bg-slate-100 my-1 rounded-lg items-center p-2 flex "
        content="no-underline"
        href={link}
        onClick={onClick}
      >
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>
              <p> {title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* {icon} */}

        {active && (
          <span className={`${selected ? "text-orange-500 " : ""}`}>
            {title}
          </span>
        )}
      </Link>
    </div>
  );
}
interface SidebarItemProps {
  // title: string;
  id: number;
  text: string;
  active: boolean;
  alert: boolean;
  selected: boolean;

  children: ReactNode;
  // link: string;
  onselect: (id: number) => void;
  //setopenclode: () => void;
  icon: ReactNode;
}
export function SidebarItem({
  id,
  icon,
  //setopenclode,
  selected,
  text,
  active,
  alert,
  // link,
  onselect,
  // subMenu,
  children,
}: SidebarItemProps) {
  const expanded = useContext(SidebarContext);

  // console.log("expanded>", expanded);
  return (
    <li
      // onClick={() => onselect(id)}
      className={`
      
      gap-2 
        relative flex flex-col items-start  py-3 px-2 my-2
        font-medium rounded-md cursor-pointer justify-center
        transition-colors group
        ${
          active
            ? " shadow-sm dark:bg-[#121415] bg-slate-50 dark:text-white text-slate-600"
            : "hover:bg-slate-50  text-gray-600"
        }
    `}
    >
      {/* <div className="" onClick={() => setopenclode()}> */}

      <div className="">
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger className="mr-2" asChild>
              <div onClick={() => onselect(id)}>{icon}</div>
            </TooltipTrigger>
            <TooltipContent>
              <div onClick={() => onselect(id)}>
                <p> {text}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span
        className={`  transition-all ${
          expanded.expanded ? "w-48 ml-3 text-md" : " text-sm w-10"
        }`}
      >
        <Collapsible
          className="shadow-none  relative 
        transition-all duration-300 ease-in-out 
        "
          open={active}
        >
          <CollapsibleTrigger className="absolute  z-[999] -top-8 right-10">
            {expanded.expanded && (
              <div className="font-extralight" onClick={() => onselect(id)}>
                <span className="text-gray-500 font-bold  dark:text-slate-300 text-sm  no-underline">
                  {text}
                </span>
              </div>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent
          //     className="shadow-none
          // transition-all duration-300 ease-in-out
          //"
          >
            {children}
            {/* <ul className="flex flex-col gap-3">
              {subMenu?.map(
                (sub: { id: number; title: string; link: string }) => (
                  <Link
                    key={sub.id}
                    className="relative  border p-2 flex "
                    content="no-underline"
                    href={sub.link}
                  >
                    {icons}
                    <li key={sub.id}>{sub.title}</li>
                  </Link>
                )
              )}
            </ul> */}
          </CollapsibleContent>
        </Collapsible>
      </span>
      {/* {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded.expanded ? "" : "top-2"
          }`}
        />
      )} */}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
