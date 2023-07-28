"use client";
import { HomeIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
type Props = {};

export default function TopBanner({}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-8 ">
        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fb8b86] shadow-lg shadow-[#fead92]/50 to-[#fead92] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div
            className="absolute bottom-1 right-1 w-[70px] h-[70px] rounded-l-3xl 
        rounded-tl-[105px] 
        rounded-tr-[85px]
        rounded-br-[115px]
        rounded-bl-[95px]


         bg-white/40"
          ></div>

          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#6d7fe5] shadow-lg shadow-[#6d7fe5]/50 to-[#6066de] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={2}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fd83aa] shadow-lg shadow-[#fd83aa]/50 to-[#ff548a] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#45a6e6] shadow-lg shadow-[#45a6e6]/50 to-[#1d8fdb] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#fff8ec]
                  rounded-tl-[125px] 
                  rounded-tr-[165px]
                 rounded-br-[135px]
                 rounded-bl-[115px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#ffb52c]"></AcademicCapIcon>
          </div>
          <span className="text-[#ffa600]">اطلاعات واحد</span>
        </div>

        <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#ecefff]
                  rounded-tl-[105px] 
                  rounded-tr-[155px]
                 rounded-br-[115px]
                 rounded-bl-[135px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#6541f6]"></AcademicCapIcon>
          </div>

          <span className="text-[#6541f6]">اطلاعات واحد</span>
        </div>
      </div>
    </div>
  );
}
