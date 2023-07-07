"use client";
import React, { useEffect, useState } from "react";
import { SunIcon } from "@heroicons/react/24/solid";
import { MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
type Props = { width: string; height: string; mode: string };
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};
export default function LightMode({ width, height, mode }: Props) {
  const [light, setlight] = useState(false);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // w-[${width}px] h-[${height}px]
    <div className="hidden sm:inline">
      <div
        className={`relative flex flex-row p-[3px] ${
          // "items-start"
          theme === "light" ? "items-start" : "items-end"
        }   sm:mt-4 sm:ml-4 sm:rtl:mr-4 ${width} h-[95px] dark:bg-[#2b2e31] bg-[#eef2f5] rounded-[15px]  `}
      >
        <div className="absolute   top-0 w-full z-10 h-full">
          <div className=" justify-center items-center  h-full flex flex-col flex-1">
            <div
              onClick={() => {
                setlight(!light);
                if (theme === "dark") setTheme("light");
                else setTheme("dark");
              }}
              className="flex-1 cursor-pointer flex justify-center items-center"
            >
              <SunIcon
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-blue-400" : "text-dark-400"
                } `}
              />
            </div>
            <div
              onClick={() => {
                setlight(!light);
                if (theme === "dark") setTheme("light");
                else setTheme("dark");
              }}
              className="flex-1 cursor-pointer  flex justify-center items-center"
            >
              <MoonIcon
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-blue-400" : "text-dark-400"
                } `}
              />
            </div>
          </div>
        </div>
        <motion.div
          layout
          transition={spring}
          onClick={() => {
            // setlight(!light);
            // if (theme === "dark") setTheme("light");
            // else setTheme("dark");
          }}
          className=" z-20 flex flex-col justify-center items-center  h-1/2 w-full dark:bg-[#0f172b] m-0 bg-white shadow-lg  rounded-[12px]   "
        >
          {theme == "light" && (
            <SunIcon
              className={`h-5 w-5  ${
                theme === "light" ? "text-blue-400" : "text-dark-400"
              } `}
            />
          )}
          {theme == "dark" && (
            <MoonIcon
              className={`h-5 w-5  ${
                theme === "dark" ? "text-blue-400" : "text-dark-400"
              } `}
            />
          )}
        </motion.div>
        {/* <div className='-pt-0'><SunIcon className="h-6 w-6 text-blue-500 " /></div>
        <div><MoonIcon className="h-5 w-5 " /></div> */}
      </div>
    </div>
  );
}
