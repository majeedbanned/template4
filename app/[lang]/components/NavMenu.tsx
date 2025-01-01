import { Bars4Icon } from "@heroicons/react/24/outline";
import React from "react";
import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";

type Props = {
  dictionary: {
    home: string;
    aboutus: string;
    contactus: string;
    pricing: string;
    services: string;
  };
};

export default function NavMenu({ dictionary }: Props) {
  // //console.log();
  //const dictionary = await getDictionary(lang);
  return (
    <nav className="  border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="block">
          <Bars4Icon className="w-6 h-6 md:hidden"></Bars4Icon>
        </div>
        <div
          className="hidden w-full md:block md:w-auto"
          id="navbar-multi-level"
        >
          <ul className="flex flex-col flex-wrap font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4
                dark:text-slate-300
                text-slate-700 rounded
                 hover:dark:bg-slate-800 
                 hover:text-orange-400
                  md:border-0"
                // aria-current="page"
              >
                {dictionary.home}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4
                dark:text-slate-300
                text-slate-700 rounded
                 hover:dark:bg-slate-800 
                 hover:text-orange-400
                  md:border-0"
              >
                {dictionary.aboutus}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4
                dark:text-slate-300
                text-slate-700 rounded
                 hover:dark:bg-slate-800 
                 hover:text-orange-400
                  md:border-0"
              >
                {dictionary.services}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4
                dark:text-slate-300
                text-slate-700 rounded
                 hover:dark:bg-slate-800 
                 hover:text-orange-400
                  md:border-0"
              >
                {dictionary.contactus}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4
                dark:text-slate-300
                text-slate-700 rounded
                 hover:dark:bg-slate-800 
                 hover:text-orange-400
                  md:border-0"
              >
                {dictionary.pricing}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
