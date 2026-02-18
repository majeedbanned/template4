import React from "react";
import { PageWrapper } from "../../components/PageWrapper";
import Datalist from "./components/Datalist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import client from "@/lib/prismadb1";
import { verifyAndResolveBillShareToken } from "@/lib/bill-share-token";

type Props = {};

export default async function students({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const shareCode =
    typeof searchParams?.share === "string" ? searchParams.share : undefined;
  const sharePayload = await verifyAndResolveBillShareToken(shareCode);

  const currentUser = sharePayload
    ? null
    : await getServerSession(authOptions);
  const currentUserAsAny = currentUser as any;
  const currentUserPelak =
    currentUserAsAny && typeof currentUserAsAny.user?.pelak === "string"
      ? currentUserAsAny.user.pelak
      : undefined;
  const targetPelak = sharePayload?.pelak || currentUserPelak;

  if (!targetPelak) {
    if (currentUser) {
      redirect("/admin/main");
    }
    redirect(`/${params.lang}/signinusers`);
  }

  const date = await client.tenant.findMany({
    where: {
      pelak: targetPelak,
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

  const permissionForDatalist =
    currentUser ||
    ({
      user: {
        role: "viewer",
      },
    } as any);

  if (date[0]?.malekmos === "1")
    return (
      <PageWrapper>
        <div className="overflow-scroll border-[0px] w-[400px] md:w-full">
          <Datalist
            permission={permissionForDatalist}
            pelak={sharePayload ? undefined : targetPelak}
            shareCode={shareCode}
          ></Datalist>
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
          <Datalist
            permission={permissionForDatalist}
            pelak={sharePayload ? undefined : targetPelak}
            shareCode={shareCode}
          ></Datalist>
        </div>
      </PageWrapper>
    );
}
