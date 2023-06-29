"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "../../../i18n-config";
import { LanguageIcon } from "@heroicons/react/24/outline";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex ">
      {i18n.locales.map((locale) => {
        return (
          <div className="p-1" key={locale}>
            <Link href={redirectedPathName(locale)} className="rtl:text-white">
              {locale === "ar" && "فا"}
              {locale === "en" && "En"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
