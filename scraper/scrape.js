const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const urls = [
  "https://www.facebook.com/privacy/policy/",
  "https://zoom.us/privacy",
];

function slugify(url) {
  return url.replace(/[^a-zA-Z0-9]/g, "_");
}

async function scrapeText(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return text;
}

async function summarize(text) {
  const prompt = `Summarize this privacy policy. Focus on data collection, usage, permissions, sharing, and anything noteworthy:\n\n${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

async function compareAndSummarize(url) {
  const slug = slugify(url);
  const currentPath = `./snapshots/${slug}.txt`;

  console.log(`\n🔍 Checking ${url}`);
  const newText = await scrapeText(url);

  let changed = true;
  if (fs.existsSync(currentPath)) {
    const oldText = fs.readFileSync(currentPath, "utf-8");
    changed = newText.trim() !== oldText.trim();
  }

  if (!changed) {
    console.log(`✅ No changes detected for ${url}`);
    return;
  }

  console.log(`⚠️ Change detected! Re-summarizing...`);
  const summary = await summarize(newText);

  fs.writeFileSync(currentPath, newText);
  fs.writeFileSync(`./summary_${slug}.txt`, summary);
  console.log(`✅ Summary updated: summary_${slug}.txt`);
}

(async () => {
  for (const url of urls) {
    await compareAndSummarize(url);
  }
})();
