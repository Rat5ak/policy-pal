import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summaries, setSummaries] = useState([]);
  const [status, setStatus] = useState("");

  const fetchSummaries = async () => {
    try {
      const res = await axios.get("https://policy-pal-production.up.railway.app/summaries");
  
      const fullSummaries = await Promise.all(res.data.map(async ({ slug, title }) => {
        try {
          const summaryRes = await axios.get(`https://policy-pal-production.up.railway.app/summary/${slug}`);
          return { title, summary: summaryRes.data };
        } catch {
          return { title, summary: "⚠️ Failed to fetch summary." };
        }
      }));
  
      setSummaries(fullSummaries);
    } catch (err) {
      console.error("❌ Failed to load summaries", err);
    }
  };
  
  const triggerScrape = () => {
    setStatus("Scraping...");
    axios.post("https://policy-pal-production.up.railway.app/scrape-now")
      .then(() => {
        setStatus("Scrape complete. Updating summaries...");
        setTimeout(() => {
          fetchSummaries();
          setStatus("");
        }, 1500);
      })
      .catch(() => {
        setStatus("Scrape failed.");
      });
  };

  return (
    <div style={{
      backgroundColor: "#1e1e1e",
      color: "#f5f5f5",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "monospace",
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🕵️ PolicyPal</h1>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={triggerScrape}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            border: "none",
            backgroundColor: "#89ddff",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Scrape Now
        </button>
        {status && (
          <span style={{ marginLeft: "1rem", color: "#ccc" }}>{status}</span>
        )}
      </div>

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
