import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://policy-pal-production.up.railway.app/") // your backend
      .then(res => setSummary(res.data))
      .catch(() => setError("Failed to fetch summary."));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🕵️ PolicyPal</h1>
      <h3 style={{ color: "#89ddff" }}>AI Summary:</h3>
      <pre
        style={{
          backgroundColor: "#2d2d2d",
          padding: "1rem",
          borderRadius: "0.5rem",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {error || summary}
      </pre>
    </div>
  );
}

export default App;
