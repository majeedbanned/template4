"use client";

import React, { useState, FormEvent } from "react";

interface ResponseData {
  // Define the shape of the response data here based on what the API returns
  [key: string]: any;
}

const PaymentForm: React.FC = () => {
  const [terminalID] = useState<string>("98780551");
  const [amount, setAmount] = useState<string>("20000");
  const [invoiceID, setInvoiceID] = useState<string>("103");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        body: new URLSearchParams({
          TerminalID: terminalID,
          Amount: amount,
          invoiceID: invoiceID,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ResponseData = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="TerminalID" value={terminalID} readOnly />
          <input
            type="text"
            name="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            name="invoiceID"
            value={invoiceID}
            onChange={(e) => setInvoiceID(e.target.value)}
          />
          <input type="submit" value="پرداخت" className="submit" />
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
