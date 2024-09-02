import React from "react";
import ChangePassword from "./components/ChangePassword";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
export default async function page() {
  const currentUser = await getServerSession(authOptions);

  return (
    <div>
      <ChangePassword user={currentUser}></ChangePassword>
    </div>
  );
}
