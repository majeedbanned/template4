import React from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
type Props = {};

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      amount: 10000,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "2",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "3",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "4",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "5",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "6",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "7",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "8",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "9",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "10",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },

    {
      id: "11",
      amount: 1250,
      status: "processing",
      email: "example@gmail.com",
    },
  ];
}
export default async function datalist({}: Props) {
  const data = await getData();
  return (
    <PageWrapper>
      <DataTable columns={columns} data={data} />
    </PageWrapper>
  );
}
