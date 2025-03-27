import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summaries, setSummaries] = useState([]);
  const backendURL = "https://scraper-production-5468.up.railway.app";

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await axios.get(`${backendURL}/summaries`);

        const fullSummaries = await Promise.all(
          res.data.map(async ({ slug, title }) => {
            try {
              const summaryRes = await axios.get(`${backendURL}/summary/${slug}`);
              return { title, summary: summaryRes.data };
            } catch {
              return { title, summary: "⚠️ Failed to fetch summary." };
            }
          })
        );

        setSummaries(fullSummaries);
      } catch (err) {
        console.error("❌ Failed to load summaries", err);
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div style={{
      backgroundColor: "#1e1e1e",
      color: "#f5f5f5",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "monospace",
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🕵️ PolicyPal</h1>

      {summaries.map(({ title, summary }, i) => (
        <div key={i} style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#ffcb6b" }}>{title}</h2>
          <pre style={{
            backgroundColor: "#2d2d2d",
            padding: "1rem",
            borderRadius: "0.5rem",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}>
            {summary}
          </pre>
        </div>
      ))}
    </div>
  );
}

export default App;
