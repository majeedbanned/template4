"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "../../../i18n-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { US, IR, CA, FR } from "country-flag-icons/react/3x2";

import { Button } from "@/components/ui/button";
import { LanguageIcon } from "@heroicons/react/24/solid";
type Props = {};

export default function LangSelect({}: Props) {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="relative border-0 p-2 m-0 rounded-full w-10 h-10 "
              variant="secondary"
            >
              <LanguageIcon className="text-slate-600" fontSize={32} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-[20px]">
            <DropdownMenuLabel>Languages</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {i18n.locales.map((locale) => {
              return (
                <div className="p-0" key={locale}>
                  <DropdownMenuItem>
                    <Link
                      href={redirectedPathName(locale)}
                      className=" flex items-center h-6 flex-1"
                    >
                      {locale === "fa" && (
                        <>
                          <US title="United States" className="w-4 h-4 m-2" />
                          English
                        </>
                      )}
                      {locale === "cs" && (
                        <>
                          <IR title="Iran" className="w-4 h-4 m-2" />
                          Persian
                        </>
                      )}
                      {locale === "cs" && (
                        <>
                          <FR title="France" className="w-4 h-4 m-2" />
                          France
                        </>
                      )}
                    </Link>
                  </DropdownMenuItem>
                </div>
              );
            })}

            {/* <DropdownMenuItem>
              <US title="United States" className="w-4 h-4 m-2" />
              English
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IR title="Iran" className="w-4 h-4 m-2" />
              Persian
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
