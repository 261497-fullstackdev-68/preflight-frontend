import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data1, setData1] = useState<string | null>(null);
  const [data2, setData2] = useState<string | null>(null);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  useEffect(() => {
    //   // Use the proxied path /api
    //   fetch("/api/")
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //       }
    //       return response.text();
    //     })
    //     .then((text) => {
    //       setData1(text);
    //     })
    //     .catch((err) => {
    //       setError1(err.message);
    //       console.error("Failed to fetch data:", err);
    //     });

    //   fetch("http://pf-backend:3000/api/")
    //     .then((res) => {
    //       if (!res.ok) {
    //         throw new Error("Network response was not ok");
    //       }
    //       return res.text();
    //     })
    //     .then((text) => {
    //       setData2(text);
    //     })
    //     .catch((err) => {
    //       setError2(err.message);
    //       console.error("Failed to fetch data:", err);
    //     });
    // }, []);

  return (
    <div className="App">
      <h1>Frontend-Backend Connection Test</h1>
      {<p>API Response1: {data1}</p>}
      {<p>API Response2: {data2}</p>}
      {<p style={{ color: "red" }}>Error1: {error1}</p>}
      {<p style={{ color: "red" }}>Error2: {error2}</p>}
    </div>
  );
}

export default App;
