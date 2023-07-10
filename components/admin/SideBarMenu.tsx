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

  return (
    <div>
      <LightMode width="w-[70px]" height="14" mode="horizental"></LightMode>
      <Sidebar lang="">
        <SidebarItem
          onselect={() => setSelected(1)}
          id={1}
          active={1 === Selected}
          text="dashboard"
          alert
          icon={
            <HomeIcon
              fontSize={20}
              className="w-6 h-6 dark:text-white text-[#8b99a4]"
            ></HomeIcon>
          }
        >
          <MenuItem
            title="
            dashboard"
            link="admin/dashboard"
            icon={
              <LayoutDashboard
                fontSize={20}
                className="w-6 h-6 dark:text-white text-[#8b99a4]"
              ></LayoutDashboard>
            }
          ></MenuItem>

          <MenuItem
            title="datalist"
            link="admin/datalist"
            icon={
              <LayoutDashboard
                fontSize={20}
                className="w-6 h-6 dark:text-white text-[#8b99a4]"
              ></LayoutDashboard>
            }
          ></MenuItem>
        </SidebarItem>

        <SidebarItem
          onselect={() => setSelected(2)}
          key={2}
          id={2}
          active={2 === Selected}
          text="lists"
          alert
          icon={
            <EnvelopeIcon
              fontSize={20}
              className="w-6 h-6 dark:text-white text-[#8b99a4]"
            ></EnvelopeIcon>
          }
        >
          <MenuItem
            title="datalist"
            link="admin/datalist"
            icon={
              <ChatBubbleLeftIcon
                fontSize={20}
                className="w-6 h-6 dark:text-white text-[#8b99a4]"
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
