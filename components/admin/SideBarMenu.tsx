"use client";
import React, { useState } from "react";
import Sidebar, {
  MenuItem,
  SidebarItem,
} from "../../app/[lang]/components/sidebar/Sidebar";
import { TvIcon, MessageCircle, LayoutDashboard } from "lucide-react";
import LightMode from "../ui/LightMode";
import { menuData } from "@/lib/data/menu";
import logo from "@/public/images/logo.png";
import {
  ChartBarIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  HomeIcon,
  LockClosedIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import {
  BanknotesIcon,
  BuildingStorefrontIcon,
  CalculatorIcon,
  ChatBubbleLeftIcon,
  FingerPrintIcon,
  HomeModernIcon,
  KeyIcon,
  PencilSquareIcon,
  TicketIcon,
  UserIcon,
  RectangleStackIcon,
  BookOpenIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth/core/types";
type Props = {};

export default function SideBarMenu({ cu }: { cu?: Session | null }) {
  const [Selected, setSelected] = useState(2);
  const [activeMenu, setActiveMenu] = useState(0);

  const [exp, setExp] = useState(false);

  const storeAcc = cu?.user?.Permission?.find((item) => {
    return item.systemID === 1 && item.view === true;
  });
  const ownerAcc = cu?.user?.Permission?.find((item) => {
    return item.systemID === 4 && item.view === true;
  });
  const tenantAcc = cu?.user?.Permission?.find((item) => {
    return item.systemID === 3 && item.view === true;
  });
  const usersAcc = cu?.user?.Permission?.find((item) => {
    return item.systemID === 6 && item.view === true;
  });

  const robAcc = cu?.user?.Permission?.find((item) => {
    return item.systemID === 9 && item.view === true;
  });

  let isAdmin = false;
  if (cu?.user.role === "admin") {
    isAdmin = true;
  }

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

      {
        //@ts-ignore
        cu?.user?.type === "admin" ? (
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
                  <ComputerDesktopIcon
                    fontSize={20}
                    className={`${
                      activeMenu === 1 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></ComputerDesktopIcon>
                }
              ></MenuItem>

              {(storeAcc || isAdmin) && (
                <MenuItem
                  onClick={() => setActiveMenu(2)}
                  selected={activeMenu === 2}
                  active={exp}
                  title="
            مدیریت شارژ"
                  link="admin/stores"
                  icon={
                    <BanknotesIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 2 ? " text-orange-400" : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></BanknotesIcon>
                  }
                ></MenuItem>
              )}
              {(ownerAcc || isAdmin) && (
                <MenuItem
                  onClick={() => setActiveMenu(3)}
                  selected={activeMenu === 3}
                  active={exp}
                  title="
            مالکین"
                  link="admin/owner/all"
                  icon={
                    <UserIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 3 ? " text-orange-400" : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></UserIcon>
                  }
                ></MenuItem>
              )}

              {(tenantAcc || isAdmin) && (
                <MenuItem
                  onClick={() => setActiveMenu(4)}
                  selected={activeMenu === 4}
                  active={exp}
                  title="
            مستاجرین"
                  link="admin/tenant/all"
                  icon={
                    <BuildingStorefrontIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 4 ? " text-orange-400" : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></BuildingStorefrontIcon>
                  }
                ></MenuItem>
              )}

              {(robAcc || isAdmin) && (
                <MenuItem
                  onClick={() => setActiveMenu(5)}
                  selected={activeMenu === 5}
                  active={exp}
                  title="
            سرقفلی"
                  link="admin/rob/all"
                  icon={
                    <BookOpenIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 5 ? " text-orange-400" : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></BookOpenIcon>
                  }
                ></MenuItem>
              )}
            </SidebarItem>

            {cu?.user.role === "admin" && (
              <SidebarItem
                selected={activeMenu === 1}
                onselect={() => {
                  if (Selected === 2) setSelected(0);
                  else setSelected(2);
                }}
                key={2}
                id={2}
                active={2 === Selected}
                text="اطلاعات پایه"
                alert
                icon={
                  <Cog8ToothIcon
                    fontSize={20}
                    className={`${
                      Selected === 2 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></Cog8ToothIcon>
                }
              >
                <MenuItem
                  onClick={() => setActiveMenu(10)}
                  selected={activeMenu === 10}
                  active={exp}
                  title="تعرفه ها"
                  link="admin/chargedef"
                  icon={
                    <CalculatorIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 10
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></CalculatorIcon>
                  }
                ></MenuItem>

                <MenuItem
                  onClick={() => setActiveMenu(15)}
                  selected={activeMenu === 15}
                  active={exp}
                  title="تخفیف ها"
                  link="admin/discountdef"
                  icon={
                    <TicketIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 15
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></TicketIcon>
                  }
                ></MenuItem>

                <MenuItem
                  onClick={() => setActiveMenu(11)}
                  selected={activeMenu === 11}
                  active={exp}
                  title="تعریف نوع واحد"
                  link="admin/nov"
                  icon={
                    <PencilSquareIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 11
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></PencilSquareIcon>
                  }
                ></MenuItem>
                <MenuItem
                  onClick={() => setActiveMenu(12)}
                  selected={activeMenu === 12}
                  active={exp}
                  title="تعریف تراز "
                  link="admin/tabagh"
                  icon={
                    <PencilSquareIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 12
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></PencilSquareIcon>
                  }
                ></MenuItem>
                <MenuItem
                  onClick={() => setActiveMenu(13)}
                  selected={activeMenu === 13}
                  active={exp}
                  title="تعریف بلوک "
                  link="admin/bazar"
                  icon={
                    <PencilSquareIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 13
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></PencilSquareIcon>
                  }
                ></MenuItem>
                <MenuItem
                  onClick={() => setActiveMenu(14)}
                  selected={activeMenu === 14}
                  active={exp}
                  title="تعریف راهرو "
                  link="admin/rahro"
                  icon={
                    <PencilSquareIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 14
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></PencilSquareIcon>
                  }
                ></MenuItem>
              </SidebarItem>
            )}

            <SidebarItem
              selected={activeMenu === 1}
              onselect={() => {
                if (Selected === 3) setSelected(0);
                else setSelected(3);
              }}
              key={3}
              id={3}
              active={3 === Selected}
              text="تنظیمات امنیتی"
              alert
              icon={
                <LockClosedIcon
                  fontSize={20}
                  className={`${
                    Selected === 3 ? " text-orange-400" : "text-[#8b99a4]"
                  } w-6 h-6 dark:text-white `}
                ></LockClosedIcon>
              }
            >
              {(usersAcc || isAdmin) && (
                <MenuItem
                  onClick={() => setActiveMenu(20)}
                  selected={activeMenu === 20}
                  active={exp}
                  title="تعریف کاربران"
                  link="admin/users"
                  icon={
                    <KeyIcon
                      fontSize={20}
                      className={`${
                        activeMenu === 20
                          ? " text-orange-400"
                          : "text-[#8b99a4]"
                      } w-6 h-6 dark:text-white `}
                    ></KeyIcon>
                  }
                ></MenuItem>
              )}
              <MenuItem
                onClick={() => setActiveMenu(21)}
                selected={activeMenu === 21}
                active={exp}
                title="لاگ کاربران"
                link="admin/history"
                icon={
                  <FingerPrintIcon
                    fontSize={20}
                    className={`${
                      activeMenu === 21 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></FingerPrintIcon>
                }
              ></MenuItem>

              <MenuItem
                onClick={() => setActiveMenu(22)}
                selected={activeMenu === 22}
                active={exp}
                title="صدور گروهی قبض"
                link="admin/autocharge"
                icon={
                  <RectangleStackIcon
                    fontSize={20}
                    className={`${
                      activeMenu === 22 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></RectangleStackIcon>
                }
              ></MenuItem>

              <MenuItem
                onClick={() => setActiveMenu(23)}
                selected={activeMenu === 23}
                active={exp}
                title="چاپ گروهی قبض"
                link="admin/autoprint"
                icon={
                  <PrinterIcon
                    fontSize={20}
                    className={`${
                      activeMenu === 23 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></PrinterIcon>
                }
              ></MenuItem>
            </SidebarItem>

            <SidebarItem
              selected={activeMenu === 1}
              onselect={() => {
                if (Selected === 4) setSelected(0);
                else setSelected(4);
              }}
              key={4}
              id={4}
              active={4 === Selected}
              text="اطلاعات پایه"
              alert
              icon={
                <ChartBarIcon
                  fontSize={20}
                  className={`${
                    Selected === 4 ? " text-orange-400" : "text-[#8b99a4]"
                  } w-6 h-6 dark:text-white `}
                ></ChartBarIcon>
              }
            >
              <MenuItem
                onClick={() => setActiveMenu(30)}
                selected={activeMenu === 30}
                active={exp}
                title="گزارشات"
                link="admin/reports?date=1402-05"
                icon={
                  <DocumentChartBarIcon
                    fontSize={20}
                    className={`${
                      activeMenu === 30 ? " text-orange-400" : "text-[#8b99a4]"
                    } w-6 h-6 dark:text-white `}
                  ></DocumentChartBarIcon>
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
        ) : (
          //@ts-ignore
          <Sidebar lang="" onExpand={handleExpand}></Sidebar>
        )
      }
    </div>
  );
}
