"use client";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  TvIcon,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useContext, createContext, useState, ReactNode } from "react";
import { motion } from "framer-motion";
const SidebarContext = createContext({ expanded: false });
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const icons = {
    TvIcon: TvIcon,
    MessageCircle: MessageCircle,
  };
  return (
    <aside className="h-screen hidden sm:inline-flex rounded-[15px] dark:bg-[#2b2e31] bg-[#eef2f5] sm:mt-2 sm:mx-4">
      <nav className="h-full flex flex-col  shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface MenuItemProps {
  title: string;
  link: string;
  icon: ReactNode;
}
export function MenuItem({ title, link, icon }: MenuItemProps) {
  return (
    <div>
      <Link
        // key={sub.id}
        className="relative  gap-2 items-center p-2 flex "
        content="no-underline"
        href={link}
      >
        {icon}
        <span>{title}</span>
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
  children: ReactNode;
  // link: string;
  onselect: (id: number) => void;
  icon: ReactNode;
}
export function SidebarItem({
  id,
  icon,
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
      onClick={() => onselect(id)}
      className={`
      
        relative flex items-start py-3 px-3 my-2
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? " shadow-sm dark:bg-[#0f172b] bg-slate-50 dark:text-white text-indigo-800"
            : "hover:bg-slate-50  text-gray-600"
        }
    `}
    >
      <div className="">{icon}</div>
      <span
        className={`overflow-hidden transition-all ${
          expanded.expanded ? "w-52 ml-3 text-md" : " text-sm w-0"
        }`}
      >
        <Collapsible className="shadow-none" open={active}>
          <CollapsibleTrigger>
            <span className="text-gray-600 font-bold  dark:text-white  no-underline">
              {text}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="">
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
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded.expanded ? "" : "top-2"
          }`}
        />
      )}

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
