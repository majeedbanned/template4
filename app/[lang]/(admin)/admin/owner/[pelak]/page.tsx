import React from "react";
import { PageWrapper } from "../../../components/PageWrapper";
import Datalist from "../components/Datalist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

type Props = {};

export default async function students({}: Props) {
  const currentUser = await getServerSession(authOptions);

  const access = currentUser?.user?.Permission?.find((item) => {
    return item.systemID === 4 && item.view === true;
  });

  const isadmin = currentUser?.user?.role === "admin";

  if (!isadmin) if (!access) redirect("/admin/main");

  return (
    <PageWrapper>
      <Datalist permission={currentUser}></Datalist>
    </PageWrapper>
  );
}
