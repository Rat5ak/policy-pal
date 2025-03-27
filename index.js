const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();

app.use(cors({ origin: "https://policy-pal-six.vercel.app" }));
app.use(express.json());

const urls = [
  "https://www.facebook.com/policy.php",
  "https://help.instagram.com/519522125107875",
  "https://x.com/en/privacy",
  "https://www.linkedin.com/legal/privacy-policy",
  "https://values.snap.com/privacy/privacy-policy",
  "https://www.tiktok.com/legal/page/us/privacy-policy/en",
  "https://policies.google.com/privacy?hl=en-US",
  "https://www.reddit.com/policies/privacy-policy",
  "https://policy.pinterest.com/en/privacy-policy",
  "https://www.whatsapp.com/legal/privacy-policy",
];


// ✅ Ensure snapshots folder exists
const snapshotsDir = path.join(__dirname, "snapshots");
if (!fs.existsSync(snapshotsDir)) {
  fs.mkdirSync(snapshotsDir);
}

function slugify(url) {
  return url.replace(/[^a-zA-Z0-9]/g, "_");
}

async function scrapeText(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return text;
}

async function summarize(text) {
  const maxCharLength = 300000;
  const safeText = text.length > maxCharLength ? text.slice(0, maxCharLength) : text;

  const prompt = `
You are an AI that summarizes privacy policies into clear, consistent, and easy-to-read sections.

Use **this exact format** and Markdown styling for every summary. Do not invent extra sections or omit any. Stick to the structure:

---

## 🔍 Summary  
Give a 1–2 sentence neutral overview of the company’s privacy approach.

---

## 📥 Data Collected  
- What kinds of data? (e.g. name, email, location, usage, device, etc.)

---

## 🎯 How Data Is Used  
- Ads? Personalization? Analytics? Security? Be direct.

---

## 🔗 Data Sharing  
- With partners, law enforcement, or third parties? Any red flags?

---

## ⚙️ User Controls & Rights  
- Can users access, download, delete, or limit their data?

---

## 🕒 Retention & Storage  
- How long is data stored? Is it transferred internationally?

---

## 🚨 Noteworthy Points  
Highlight any unique, shady, or especially transparent aspects.

---

Summarize the following privacy policy text using this format:\n\n${safeText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 16384,
  });

  return response.choices[0].message.content;
}

async function compareAndSummarize(url) {
  const slug = slugify(url);
  const currentPath = path.join(__dirname, `snapshots/${slug}.txt`);

  console.log(`\n🔍 Checking ${url}`);
  const newText = await scrapeText(url);

  let changed = true;
  if (fs.existsSync(currentPath)) {
    const oldText = fs.readFileSync(currentPath, "utf-8");
    changed = newText.trim() !== oldText.trim();
  }

  if (!changed) {
    console.log(`✅ No changes for ${url}`);
    return;
  }

  console.log(`⚠️ Change detected!`);
  const summary = await summarize(newText);

  fs.writeFileSync(currentPath, newText);
  fs.writeFileSync(path.join(__dirname, `summary_${slug}.txt`), summary);
  console.log(`✅ Summary updated for ${url}`);
}

// 🚀 POST /scrape-now
app.post("/scrape-now", async (req, res) => {
  try {
    for (const url of urls) {
      await compareAndSummarize(url);
    }
    res.json({ message: "Scrape completed" });
  } catch (err) {
    console.error("❌ Scrape error:", err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

// 📄 GET /summary/:slug
app.get("/summary/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, `summary_${slug}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Summary not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});

// 🗂️ GET /summaries
app.get("/summaries", (req, res) => {
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith("summary_") && f.endsWith(".txt"));
  const summaries = files.map(file => {
    const slug = file.replace("summary_", "").replace(".txt", "");
    const title = slug.replace(/https?_+/g, "").replace(/_+/g, " ").trim();
    return { slug, title };
  });
  res.json(summaries);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
