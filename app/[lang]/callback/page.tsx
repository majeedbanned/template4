import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import client from "@/lib/prismadb1";
import { revalidatePath } from "next/cache";
import React from "react";
import Form from "./components/Form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import PostedDataDisplay from "./components/PostedDataDisplay";

type Props = {};

export default async function page({}: Props) {
  // let data = await client.new_account.findMany({
  //   where: {
  //     month: "1402/05",
  //   },
  // });
  // const currentUser = await getServerSession(authOptions);
  // const access = currentUser?.user?.Permission?.find((item) => {
  //   return item.systemID === 7 && item.view === true;
  // });

  // const isadmin = currentUser?.user?.role === "admin";

  // if (!isadmin) if (!access) redirect("/admin/main");

  let idate = "";

  return (
    <div>
      <div className="flex flex-col p-2 py-4 text-blue-400 text-sm">
        <div>
          <div> نتیجه پرداخت</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap">
          {/* {data.length} */}
        </div>
      </div>

      {/* <PostedDataDisplay></PostedDataDisplay> */}

      {/* <Form></Form> */}
    </div>
  );
}
