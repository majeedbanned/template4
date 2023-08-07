"use client";
import React, { useState } from "react";
import Sidebar, {
  MenuItem,
  SidebarItem,
} from "../../app/[lang]/components/sidebar/Sidebar";
import { TvIcon, MessageCircle, LayoutDashboard } from "lucide-react";
import LightMode from "../ui/LightMode";
import { menuData } from "@/lib/data/menu";
import { EnvelopeIcon, HomeIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

type Props = {};

export default function SideBarMenu({}: Props) {
  const [Selected, setSelected] = useState(2);
  const [activeMenu, setActiveMenu] = useState(0);

  const [exp, setExp] = useState(false);

  const handleExpand = (id: boolean) => {
    setExp(id);
  };
  return (
    <div>
      <LightMode
        width={`${exp ? "w-64" : ""}`}
        height="14"
        mode="horizental"
      ></LightMode>
      <Sidebar lang="" onExpand={handleExpand}>
        <SidebarItem
          onselect={() => {
            if (Selected === 1) setSelected(0);
            else setSelected(1);
          }}
          id={1}
          selected={activeMenu === 1}
          active={1 === Selected}
          text="امکانات"
          alert
          icon={
            <HomeIcon
              fontSize={20}
              className={`${
                Selected === 1 ? " text-orange-400" : "text-[#8b99a4]"
              } w-6 h-6 dark:text-white `}
            ></HomeIcon>
          }
        >
          <MenuItem
            onClick={() => setActiveMenu(1)}
            selected={activeMenu === 1}
            active={exp}
            title="
            داشبرد"
            link="admin/main"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 5 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>
          <MenuItem
            onClick={() => setActiveMenu(2)}
            selected={activeMenu === 2}
            active={exp}
            title="
            شارژ"
            link="admin/charge"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 2 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>
          <MenuItem
            onClick={() => setActiveMenu(3)}
            selected={activeMenu === 3}
            active={exp}
            title="
            Stores"
            link="admin/stores"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 3 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>

          <MenuItem
            onClick={() => setActiveMenu(4)}
            selected={activeMenu === 4}
            active={exp}
            title="
            dashboard"
            link="admin/dashboard"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 4 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>

          <MenuItem
            onClick={() => setActiveMenu(5)}
            selected={activeMenu === 5}
            active={exp}
            title="datalist"
            link="admin/datalist"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 5 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>
          <MenuItem
            onClick={() => setActiveMenu(6)}
            selected={activeMenu === 6}
            active={exp}
            title="Users"
            link="admin/students"
            icon={
              <LayoutDashboard
                fontSize={20}
                className={`${
                  activeMenu === 6 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></LayoutDashboard>
            }
          ></MenuItem>
        </SidebarItem>

        <SidebarItem
          selected={activeMenu === 1}
          onselect={() => {
            if (Selected === 2) setSelected(0);
            else setSelected(2);
          }}
          key={2}
          id={2}
          active={2 === Selected}
          text="lists"
          alert
          icon={
            <EnvelopeIcon
              fontSize={20}
              className={`${
                Selected === 2 ? " text-orange-400" : "text-[#8b99a4]"
              } w-6 h-6 dark:text-white `}
            ></EnvelopeIcon>
          }
        >
          <MenuItem
            onClick={() => setActiveMenu(7)}
            selected={activeMenu === 7}
            active={exp}
            title="datalist"
            link="admin/datalist"
            icon={
              <ChatBubbleLeftIcon
                fontSize={20}
                className={`${
                  activeMenu === 1 ? " text-orange-400" : "text-[#8b99a4]"
                } w-6 h-6 dark:text-white `}
              ></ChatBubbleLeftIcon>
            }
          ></MenuItem>
        </SidebarItem>
        {/* ))} */}
        {/* <SidebarItem
          active={true}
          text="Datalist"
          link="admin/datalist"
          alert
          icon={<TvIcon fontSize={20} className="w-6 h-6"></TvIcon>}
        ></SidebarItem>
        <SidebarItem
          link="admin/dashboard"
          active={false}
          text="Home"
          alert
          icon={<TvIcon fontSize={20} className="w-6 h-6"></TvIcon>}
        ></SidebarItem> */}
      </Sidebar>
    </div>
  );
}
