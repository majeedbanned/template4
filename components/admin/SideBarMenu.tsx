import React from "react";
import Sidebar, {
  SidebarItem,
} from "../../app/[lang]/components/sidebar/Sidebar";
import { TvIcon } from "lucide-react";

type Props = {};

export default function SideBarMenu({}: Props) {
  return (
    <Sidebar lang="">
      <SidebarItem
        active={false}
        text="Home"
        alert
        icon={<TvIcon fontSize={20} className="w-6 h-6"></TvIcon>}
      ></SidebarItem>
      <SidebarItem
        active={true}
        text="Home"
        alert
        icon={<TvIcon fontSize={20} className="w-6 h-6"></TvIcon>}
      ></SidebarItem>
      <SidebarItem
        active={false}
        text="Home"
        alert
        icon={<TvIcon fontSize={20} className="w-6 h-6"></TvIcon>}
      ></SidebarItem>
    </Sidebar>
  );
}
