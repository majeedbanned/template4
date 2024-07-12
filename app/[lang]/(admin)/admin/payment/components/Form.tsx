"use client";
import React, { useState, FormEvent } from "react";

interface ResponseData {
  // Define the shape of the response data here based on what the API returns
  [key: string]: any;
}

const PaymentForm: React.FC = () => {
  const [terminalID] = useState<string>("98780551");
  const [token] = useState<string>("AccessToken");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("TerminalID", terminalID);
    formData.append("token", token);
    formData.append("getMethod", "1");

    try {
      const res = await fetch("https://sepehr.shaparak.ir:8080/Pay", {
        method: "POST",
        body: formData,
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
          <input type="text" name="token" value={token} readOnly />
          <input name="getMethod" type="hidden" value="1" />
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
