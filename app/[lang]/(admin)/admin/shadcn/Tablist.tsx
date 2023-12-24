import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformationTab from "./InformationTab";

type Props = {};

export default function Tablist({}: Props) {
  return (
    <div>
      <Tabs defaultValue="account" className="w-full h-18">
        <TabsList className="h-18 w-full">
          <TabsTrigger className="h-16 w-1/4 font-bold capitalize" value="BI">
            <p className="font-extrabold text-lg capitalize">
              Basic Information
            </p>
          </TabsTrigger>
          <TabsTrigger className="h-16 w-1/4" value="MI">
            <p className="font-extrabold text-lg capitalize">
              More Information
            </p>
          </TabsTrigger>
          <TabsTrigger className="h-16 w-1/4" value="ES">
            <p className="font-extrabold text-lg capitalize">Email Settings</p>
          </TabsTrigger>
          <TabsTrigger className="h-16 w-1/4" value="OT">
            <p className="font-extrabold text-lg capitalize">Others</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="BI">
          <InformationTab />
        </TabsContent>
        <TabsContent value="MI"> More Information</TabsContent>
        <TabsContent value="ES">Email Settings</TabsContent>

        <TabsContent value="OT">Others</TabsContent>
      </Tabs>
    </div>
  );
}
