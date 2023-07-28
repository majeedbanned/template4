import React from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import TopBanner from "./components/TopBanner";
type Props = {};

export default async function students({}: Props) {
  const currentUser = await getServerSession(authOptions);

  return (
    <div>
      <TopBanner></TopBanner>
    </div>
  );
}
