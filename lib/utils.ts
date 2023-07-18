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

