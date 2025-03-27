import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summaries, setSummaries] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
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

  const toggle = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <div style={{
      backgroundColor: "#1e1e1e",
      color: "#f5f5f5",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "monospace",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🕵️ PolicyPal</h1>

      {summaries.map(({ title, summary }, i) => (
        <div key={i} style={{ marginBottom: "1rem", border: "1px solid #333", borderRadius: "0.5rem" }}>
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              textAlign: "left",
              backgroundColor: "#2d2d2d",
              padding: "1rem",
              fontWeight: "bold",
              color: "#ffcb6b",
              border: "none",
              borderRadius: "0.5rem 0.5rem 0 0",
              cursor: "pointer"
            }}
          >
            {openIndex === i ? `▼ ${title}` : `▶ ${title}`}
          </button>

          {openIndex === i && (
            <pre style={{
              backgroundColor: "#2d2d2d",
              padding: "1rem",
              borderRadius: "0 0 0.5rem 0.5rem",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              borderTop: "1px solid #444"
            }}>
              {summary}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
