import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tablist from "./Tablist";

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <Tablist></Tablist>
    </>
  );
}
