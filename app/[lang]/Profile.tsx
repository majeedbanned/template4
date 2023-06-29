"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, UserIcon } from "@heroicons/react/24/outline";
import LocaleSwitcher from "./components/locale-switcher";
import Link from "next/link";

const Profile = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    //flex flex-1 space-x-12 items-center
    <div className="flex items-center ">
      <div
        className="border
         dark:rtl:border-orange-300 
        dark:ltr:border-slate-700 
        rtl:border-orange-300 
        ltr:border-slate-300

      flex m-2 rounded-full w-10 h-10  justify-center items-center hover:bg-orange-300"
      >
        <Link href="/sign-in">
          <UserIcon className="w-5 h-4 text-slate-500 rtl:text-white"></UserIcon>
        </Link>
      </div>
      <div
        className={`cursor-pointer border ${
          theme === "dark" ? "hover:bg-white" : "hover:bg-slate-800"
        }  flex m-2  first-letter:
        dark:rtl:border-orange-300 
        dark:ltr:border-slate-700 
        rtl:border-orange-300 
        ltr:border-slate-300
        rounded-full justify-center items-center w-10 h-10`}
        onClick={() => {
          if (theme === "dark") setTheme("light");
          else setTheme("dark");
        }}
      >
        {theme === "light" ? (
          <MoonIcon className="w-5 h-5 text-slate-500  rtl:text-white"></MoonIcon>
        ) : (
          <SunIcon className="w-5 h-5 text-slate-500  rtl:text-white"></SunIcon>
        )}
      </div>
      <div className="flex flex-row">
        <LocaleSwitcher></LocaleSwitcher>
      </div>
    </div>
  );
};

export default Profile;
