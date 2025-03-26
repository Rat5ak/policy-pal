const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");
const puppeteer = require("puppeteer");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

const urls = [
  "https://www.bbc.com/news",
  "https://edition.cnn.com",
  "https://techcrunch.com",
  "https://www.reddit.com/r/privacy/",
];

// 🔧 Util
function slugify(url) {
  return url.replace(/[^a-zA-Z0-9]/g, "_");
}

// 🔍 Scraping and summarizing
async function scrapeText(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return text;
}

async function summarize(text) {
  const maxCharLength = 300000;
  const safeText = text.length > maxCharLength ? text.slice(0, maxCharLength) : text;

  const prompt = `Summarize this privacy policy. Focus on data collection, usage, permissions, sharing, and anything noteworthy:\n\n${safeText}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 16384,
  });

  return response.choices[0].message.content;
}

async function compareAndSummarize(url) {
  const slug = slugify(url);
  const snapshotDir = path.join(__dirname, "snapshots");
  const snapshotPath = path.join(snapshotDir, `${slug}.txt`);
  const summaryPath = path.join(snapshotDir, `summary_${slug}.txt`);

  if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir);

  const newText = await scrapeText(url);
  let changed = true;

  if (fs.existsSync(snapshotPath)) {
    const oldText = fs.readFileSync(snapshotPath, "utf-8");
    changed = newText.trim() !== oldText.trim();
  }

  if (!changed) {
    console.log(`✅ No changes detected for ${url}`);
    return;
  }

  console.log(`⚠️ Change detected! Re-summarizing...`);
  const summary = await summarize(newText);

  fs.writeFileSync(snapshotPath, newText);
  fs.writeFileSync(summaryPath, summary);
  console.log(`✅ Summary updated: ${summaryPath}`);
}

// 🎯 Routes
app.post("/scrape-now", async (req, res) => {
  try {
    for (const url of urls) {
      await compareAndSummarize(url);
    }
    res.json({ message: "Scraping complete." });
  } catch (err) {
    console.error("❌ Scraping error:", err);
    res.status(500).json({ error: "Scraping failed." });
  }
});

app.get("/summary/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, `snapshots/summary_${slug}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Summary not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});

app.get("/summaries", (req, res) => {
  const dir = path.join(__dirname, "snapshots");
  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir).filter(f => f.startsWith("summary_"));
  const summaries = files.map(file => {
    const slug = file.replace("summary_", "").replace(".txt", "");
    const title = slug.replace(/https?_+/g, "").replace(/_+/g, " ").trim();
    return { slug, title };
  });

  res.json(summaries);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🧠 API running on port ${PORT}`));
