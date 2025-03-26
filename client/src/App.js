import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://policy-pal-production.up.railway.app/") // Use your actual Railway URL here
      .then(res => setSummary(res.data))
      .catch(err => setError("Failed to fetch summary."));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🕵️ PolicyPal</h1>
      <h3>AI Summary:</h3>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "1rem" }}>
        {error || summary}
      </pre>
    </div>
  );
}

export default App;
