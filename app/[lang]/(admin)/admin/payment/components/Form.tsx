"use client";
import React, { useState } from "react";

const Form = () => {
  const [terminalID] = useState("69000000");
  const [token] = useState("AccessToken");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
      const data = await res.json();
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

export default Form;
