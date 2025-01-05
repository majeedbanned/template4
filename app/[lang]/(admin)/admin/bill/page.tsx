import React from "react";
import { PageWrapper } from "../../components/PageWrapper";
import Datalist from "./components/Datalist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { promise } from "zod";
import { resolve } from "path";
import { useSearchParams } from "next/navigation";
import client from "@/lib/prismadb1";

type Props = {};

export default async function students({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // //console.log(searchParams);
  // //console.log(params);

  const currentUser = await getServerSession(authOptions);

  ////console.log(">>", currentUser);

  // const access = currentUser?.user?.Permission?.find((item) => {
  //   return item.systemID === 1 && item.view === true;
  // });

  // const isadmin = currentUser?.user?.role === "admin";

  // if (!isadmin) if (!access) redirect("/admin/main");
  //console.log("currentUser", currentUser);
  //@ts-ignore
  const date = await client.tenant.findMany({
    where: {
      //@ts-ignore
      pelak: currentUser?.user.pelak,
    },
    orderBy: {
      endate: "desc",
    },
  });
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Format today's date in Persian
  let todayPersian = formatter.format(new Date());

  // On some environments, you might get extra text like " ه‍.ش." appended.
  // This regex removes everything except digits (in any language) and slashes.
  //@ts-ignore
  todayPersian = todayPersian.replace(/[^\p{Number}\/]/gu, "");

  // //console.log(todayPersian);
  const enddate = date[0]?.endate || "";
  let isexpire = todayPersian > enddate;
  if (enddate === "") isexpire = false;
  //console.log(date[0].malekmos);

  // //console.log(">>>", date[0].endate);

  // //console.log("isexpire", isexpire);

  if (date[0]?.malekmos === "1")
    return (
      <PageWrapper>
        <div className="overflow-scroll border-[0px] w-[400px] md:w-full">
          <Datalist permission={currentUser}></Datalist>
        </div>
      </PageWrapper>
    );

  if (isexpire)
    return (
      <PageWrapper>
        <div className="overflow-scroll border-[0px] w-[400px] md:w-full">
          <div className="p-4 m-4">
            اخطار : مستاجر محترم ! لطفا در اسرع وقت نسبت به تحویل قرارداد اجاره
            به واحد شارژ مدیریت بازار مراجعه فرمایید
          </div>
        </div>
      </PageWrapper>
    );
  else
    return (
      <PageWrapper>
        <div className="overflow-scroll border-[0px] w-[400px] md:w-full">
          <Datalist permission={currentUser}></Datalist>
        </div>
      </PageWrapper>
    );
}
