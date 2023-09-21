import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import client from "@/lib/prismadb1";
import { revalidatePath } from "next/cache";
import React from "react";
import Form from "./components/Form";

type Props = {};

export default async function page({}: Props) {
  // let data = await client.new_account.findMany({
  //   where: {
  //     month: "1402/05",
  //   },
  // });
  let idate = "";

  return (
    <div>
      <div className="flex flex-col p-2 py-4 text-blue-400 text-sm">
        <div>
          <div> مدیریت / قبض شارژ</div>
        </div>
        <div className="flex flex-1 flex-row gap-2 justify-start items-center flex-wrap">
          {/* {data.length} */}
        </div>
      </div>

      <Form></Form>
    </div>
  );
}
