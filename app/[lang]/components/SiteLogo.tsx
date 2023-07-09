"use client";
import React from "react";

type Props = {
  dictionary: {
    maintitle: string;
    subtitle: string;
  };
};

export default function SiteLogo({ dictionary }: Props) {
  return (
    <div className="flex space-x-2">
      <div className="bg-white  rtl:bg-gray-600 w-12 h-12  rounded-full"></div>
      <div className="relative">
        <div
          className="uppercase tracking-[3px] 
            dark:rtl:text-slate-400 
            dark:ltr:text-slate-700
            ltr:text-slate-700
            rtl:text-slate-600
          text-xl font-bold antialiased"
        >
          {dictionary.maintitle}
        </div>
        <div
          className=" tracking-[6px] 
         dark:rtl:text-slate-400 
         dark:ltr:text-slate-700
         ltr:text-slate-700
         rtl:text-slate-600
        pt-[-14px] antialiased"
        >
          {dictionary.subtitle}
        </div>
      </div>
    </div>
  );
}
