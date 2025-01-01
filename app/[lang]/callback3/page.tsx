// app/fa/callback/page.tsx
"use client";
import { useEffect, useState } from "react";

const CallbackPage = () => {
  const [postData, setPostData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/fa/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exampleKey: "exampleValue" }), // Mock POST request for testing
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        //console.log("Fetched data:", data); // Log the received data
        setPostData(data.receivedData);
      } catch (error) {
        console.error("Error fetching POST data:", error);
        //  setPostData({ error: error.message });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Bank Callback Data</h1>
      {postData ? (
        <pre>{JSON.stringify(postData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CallbackPage;
