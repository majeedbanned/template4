import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Router } from "next/router";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface SWRError extends Error {
  status: number;
}

declare global {
  interface String {
    toPersianDigits(): string
   
  }
  interface String {
    toEnglishDigits():string
   
  }
}
//@ts-ignore
String.prototype.toEnglishDigits = function () {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let convertedString = this;
  for (let i = 0; i < persianDigits.length; i++) {
    convertedString = convertedString.replace(persianDigits[i], englishDigits[i]);
  }

  return convertedString;
};

String.prototype.toPersianDigits = function () {
  var id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return this.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};


export   const formatNumber = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  const characterToReplace = ",";
  const replacementCharacter = "";

  const nval = value.replace(
    new RegExp(characterToReplace, "g"),
    replacementCharacter
  );

  const amount = BigInt(nval.toEnglishDigits());

  // console.log("naval", nval.toEnglishDigits());
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IRR",
  }).format(amount);
  let ret = formatted.replace("IRR", "").trim();
  const y = ret.toPersianDigits();
  // console.log("yyy", ret);
  return ret;
};
export const setQueryString = (
  router: Router,
  param: string,
  value: string,
) => {
  if (param !== "page") delete router.query.page;
  let newQuery;
  if (value.length > 0) {
    newQuery = {
      ...router.query,
      [param]: value,
    };
  } else {
    delete router.query[param];
    newQuery = { ...router.query };
  }
  // here, we omit the slug from the query string as well
  const { slug, ...finalQuery } = newQuery;
  router.replace({
    pathname: `/${router.query.slug || "links"}`,
    query: finalQuery,
  });
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}


const logTypeToEnv = {
  cron: process.env.SLACK_HOOK_CRON,
  links: process.env.SLACK_HOOK_LINKS,
};
export const log = async ({
  message,
  type,
  mention = false,
}: {
  message: string;
  type: "cron" | "links";
  mention?: boolean;
}) => {
  /* Log a message to the console */
  
  const HOOK = logTypeToEnv[type];
  console.log(HOOK)

  if (!HOOK) return;
  try {

    return await fetch(HOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${mention ? "<@U0404G6J3NJ> " : ""}${message}`,
            },
          },
        ],
      }),
    });
  } catch (e) {

    console.log(`Failed to log to Dub Slack. Error: ${e}`);
  }
};

