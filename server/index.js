const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const summarizePolicy = require("./openai");
const { exec } = require("child_process");

const app = express();

// CORS setup: Allow Vercel domain to make requests
const corsOptions = {
  origin: "*, // Vercel frontend domain
  methods: ["GET", "POST"], // Allow these HTTP methods
};
app.use(cors(corsOptions)); // Use this CORS setup instead of the default
app.use(express.json());

app.get("/", async (req, res) => {
  const dummyText = "We collect your microphone, camera, and soul. Thank you.";
  const summary = await summarizePolicy(dummyText);
  res.send(summary);
});

app.post("/scrape-now", (req, res) => {
  exec("cd ../scraper && node scrape.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.warn(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ stdout: ${stdout}`);
    res.json({ message: "Scraper triggered successfully", output: stdout });
  });
});

// 🧠 Serve summaries from disk (scraper outputs)
app.get("/summary/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, `../scraper/summary_${slug}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Summary not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});

// 🗂 List all summaries with slugs and readable titles
app.get("/summaries", (req, res) => {
  const dir = path.join(__dirname, "../scraper");
  const files = fs.readdirSync(dir).filter(f => f.startsWith("summary_") && f.endsWith(".txt"));

  const summaries = files.map(file => {
    const slug = file.replace("summary_", "").replace(".txt", "");
    const title = slug.replace(/https?_+/g, "").replace(/_+/g, " ").trim();
    return { slug, title };
  });

  res.json(summaries);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
