"use client";

import { useState, useEffect } from "react";

interface PostedData {
  [key: string]: any;
}

export default function CallbackPage() {
  const [data, setData] = useState<PostedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/callback");
      const result = await response.json();
      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Payment Data</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data received yet.</p>
      )}
    </div>
  );
}
