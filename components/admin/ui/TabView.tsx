"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Squares2X2Icon,
  TableCellsIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

type Props = {};

export default function TabView({}: Props) {
  const [setselectedTab, setSetselectedTab] = useState("ViewColumnsIcon");

  return (
    <Tabs
      onValueChange={(value) => setSetselectedTab(value)}
      defaultValue="ViewColumnsIcon"
      className="  "
    >
      <TabsList className="rounded-full">
        <TabsTrigger className="rounded-full" value="ViewColumnsIcon">
          <ViewColumnsIcon
            className={`w-5 h-5 ${
              setselectedTab === "ViewColumnsIcon"
                ? " text-blue-500"
                : " text-gray-500"
            }`}
          ></ViewColumnsIcon>
        </TabsTrigger>
        <TabsTrigger className="rounded-full" value="Squares2X2Icon">
          <Squares2X2Icon
            className={`w-5 h-5 ${
              setselectedTab === "Squares2X2Icon"
                ? " text-blue-500"
                : " text-gray-500"
            }`}
          />
        </TabsTrigger>
        <TabsTrigger className="rounded-full" value="TableCellsIcon">
          <TableCellsIcon
            className={`w-5 h-5 ${
              setselectedTab === "TableCellsIcon"
                ? " text-blue-500"
                : " text-gray-500"
            }`}
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
