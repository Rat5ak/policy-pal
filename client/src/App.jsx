import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summaries, setSummaries] = useState([]);
  const [activeSummary, setActiveSummary] = useState(null);
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
        setActiveSummary(fullSummaries[0]); // Load first by default
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
      fontFamily: "monospace",
      display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        padding: "1rem",
        backgroundColor: "#121212",
        borderRight: "1px solid #333",
      }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🕵️ PolicyPal</h1>
        {summaries.map(({ title, summary }, i) => (
          <button
            key={i}
            onClick={() => setActiveSummary({ title, summary })}
            style={{
              width: "100%",
              marginBottom: "0.5rem",
              padding: "0.5rem",
              backgroundColor: activeSummary?.title === title ? "#333" : "#1e1e1e",
              color: "#ffcb6b",
              border: "1px solid #333",
              borderRadius: "0.3rem",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Summary panel */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {activeSummary ? (
          <>
            <h2 style={{ color: "#ffcb6b", fontSize: "1.5rem", marginBottom: "1rem" }}>
              {activeSummary.title}
            </h2>
            <pre style={{
              backgroundColor: "#2d2d2d",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}>
              {activeSummary.summary}
            </pre>
          </>
        ) : (
          <p style={{ color: "#888" }}>Loading summary...</p>
        )}
      </div>
    </div>
  );
}

export default App;
