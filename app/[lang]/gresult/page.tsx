"use client"; // Ensure this is a client component

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TransactionData {
  terminalid: string;
  invoiceid: string;
  amount: string;
  cardnumber: string;
  payload: string | null;
  rrn: string;
  tracenumber: string;
  digitalreceipt: string;
  datepaid: string;
  respcode: string;
  respmsg: string;
  issuerbank: string;
}

const GResultPage: React.FC = () => {
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams?.get("data"); // Optional chaining used here

    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setTransactionData(parsedData.receivedData as TransactionData);
      } catch (error) {
        console.error("Error parsing transaction data:", error);
      }
    }
  }, [searchParams]);

  if (!transactionData) {
    return <p>No transaction data received.</p>;
  }

  return (
    <div>
      <h1>Transaction Result</h1>
      <ul>
        <li>
          <strong>Terminal ID:</strong> {transactionData.terminalid}
        </li>
        <li>
          <strong>Invoice ID:</strong> {transactionData.invoiceid}
        </li>
        <li>
          <strong>Amount:</strong> {transactionData.amount}
        </li>
        <li>
          <strong>Card Number:</strong> {transactionData.cardnumber}
        </li>
        <li>
          <strong>RRN:</strong> {transactionData.rrn}
        </li>
        <li>
          <strong>Trace Number:</strong> {transactionData.tracenumber}
        </li>
        <li>
          <strong>Digital Receipt:</strong> {transactionData.digitalreceipt}
        </li>
        <li>
          <strong>Date Paid:</strong> {transactionData.datepaid}
        </li>
        <li>
          <strong>Response Code:</strong> {transactionData.respcode}
        </li>
        <li>
          <strong>Response Message:</strong> {transactionData.respmsg}
        </li>
        <li>
          <strong>Issuer Bank:</strong> {transactionData.issuerbank}
        </li>
      </ul>
    </div>
  );
};

export default GResultPage;
