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

const failedMarker = "⚠️ This policy could not be scraped";
const snapshotsDir = path.join(__dirname, "snapshots");
if (!fs.existsSync(snapshotsDir)) fs.mkdirSync(snapshotsDir);

function slugify(url) {
  return url.replace(/[^a-zA-Z0-9]/g, "_");
}

async function scrapeText(url) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
    ],
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

  const prompt = `
You are an AI that summarizes privacy policies into clear, consistent, and easy-to-read sections.

Always structure your summary exactly as follows using Markdown formatting:
Use only the following Markdown conventions:\n- Use \`##\` for all section headings (no bolding or other heading levels)\n- Use \`-\` for all bullet points (do not use asterisks or other symbols)\n- Leave exactly one blank line between sections\n

🗕️ Last Updated: [Insert date clearly in Month Day, Year format or explicitly state "Not specified"]

---

## 🔍 Summary  
In 1-2 sentences, describe clearly and neutrally how this company handles user data and privacy.

---

## 📥 Data Collected  
Clearly list in bullet points:
- Personal data (e.g. name, email, phone number)
- Usage data (e.g. activities, interactions)
- Device data (e.g. IP addresses, device IDs)
- Any additional notable data collected

---

## 🎯 How Data Is Used  
Briefly state in bullet points how collected data is used, covering:
- Personalization
- Advertising
- Security
- Analytics and service improvement
- Other explicit purposes

---

## 🔗 Data Sharing  
Clearly specify entities with whom data is shared:
- Partners
- Third-party providers
- Law enforcement (if applicable)
- Explicitly state if data is not sold or shared commercially

---

## ⚙️ User Controls & Rights  
Clearly list user rights and available controls:
- Access, download, and deletion of data
- Data privacy settings
- Limitations users can apply to data use or sharing

---

## 🕒 Retention & Storage  
Briefly summarize the policy’s retention period, criteria for retention, and mention any international data transfers.

---

## 🚨 Noteworthy Points  
Clearly highlight any unique, unusual, or notably transparent aspects of the policy.

---

⚠️ If you cannot access or meaningfully summarize the policy, clearly include this fallback warning:
"⚠️ This policy could not be scraped due to network restrictions, bot blocking, or missing content. Please try again later or check manually."

---

Here is the full privacy policy text to summarize:\n\n${safeText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 16384,
  });

  const summary = response.choices[0].message.content;
  const reviewed = await reviewSummary(summary);
const cleaned = reviewed.trim().replace(/\n{3,}/g, "\n\n");
return cleaned;
  return reviewed;
}

async function reviewSummary(summaryText) {
  const reviewPrompt = `
You are a second AI reviewing a privacy policy summary for clarity, correctness, and completeness.

If the summary contains the fallback warning "This policy could not be scraped...", do NOT modify anything.

Otherwise, validate each section matches the expected structure and content. If any section is vague, missing, or lacks detail, provide a corrected version of the entire summary, improving where necessary.

If the summary is excellent and requires no changes, respond with:
✅ Approved

Here is the summary to review:

${summaryText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: reviewPrompt }],
    max_tokens: 16384,
  });

  const result = response.choices[0].message.content.trim();
  return result === "✅ Approved" ? summaryText : result;
}

async function compareAndSummarize(url) {
  const slug = slugify(url);
  const currentPath = path.join(__dirname, `snapshots/${slug}.txt`);
  const summaryPath = path.join(__dirname, `summary_${slug}.txt`);

  console.log(`\n🔍 Checking ${url}`);
  const newText = await scrapeText(url);

  let changed = true;
  if (fs.existsSync(currentPath)) {
    const oldText = fs.readFileSync(currentPath, "utf-8");
    changed = newText.trim() !== oldText.trim();
  }

  let forceRetry = false;
  if (fs.existsSync(summaryPath)) {
    const previousSummary = fs.readFileSync(summaryPath, "utf-8");
    if (previousSummary.includes(failedMarker)) forceRetry = true;
  }

  if (!changed && !forceRetry) {
    console.log(`✅ No changes for ${url}`);
    return;
  }

  console.log(`⚠️ Change detected or previous summary failed. Re-summarizing...`);
  const summary = await summarize(newText);
  fs.writeFileSync(currentPath, newText);
  fs.writeFileSync(summaryPath, summary);
  console.log(`✅ Summary updated for ${url}`);
}

app.post("/scrape-now", async (req, res) => {
  res.json({ message: "Scrape started" });
  for (const url of urls) {
    try {
      await compareAndSummarize(url);
    } catch (err) {
      console.error(`❌ Error scraping ${url}:`, err);
    }
  }
  console.log("✅ All scrapes finished");
});

app.get("/summary/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, `summary_${slug}.txt`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Summary not found" });
  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});

app.get("/summaries", (req, res) => {
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith("summary_") && f.endsWith(".txt"));

  const titleMap = {
    "https___www_facebook_com_policy_php": "Facebook",
    "https___help_instagram_com_519522125107875": "Instagram",
    "https___x_com_en_privacy": "X (Twitter)",
    "https___www_linkedin_com_legal_privacy_policy": "LinkedIn",
    "https___values_snap_com_privacy_privacy_policy": "Snapchat",
    "https___www_tiktok_com_legal_page_us_privacy_policy_en": "TikTok",
    "https___policies_google_com_privacy_hl_en_US": "Google",
    "https___www_reddit_com_policies_privacy_policy": "Reddit",
    "https___policy_pinterest_com_en_privacy_policy": "Pinterest",
    "https___www_whatsapp_com_legal_privacy_policy": "WhatsApp",
  };

  const summaries = files.map(file => {
    const slug = file.replace("summary_", "").replace(".txt", "");
    const title = titleMap[slug] || slug;
    return { slug, title };
  });

  res.json(summaries);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const RETRY_FAILED_EVERY = 56 * 1000;

async function runScheduledScrape() {
  console.log("⏱️ Running scheduled scrape...");
  for (const url of urls) {
    await compareAndSummarize(url);
  }
  console.log("✅ Scheduled scrape complete.");
}

async function retryFailedSummaries() {
  for (const url of urls) {
    const slug = slugify(url);
    const summaryPath = path.join(__dirname, `summary_${slug}.txt`);
    if (fs.existsSync(summaryPath)) {
      const summary = fs.readFileSync(summaryPath, "utf-8");
      if (summary.includes(failedMarker)) {
        console.log(`🔁 Retrying failed summary: ${url}`);
        try {
          await compareAndSummarize(url);
        } catch (err) {
          console.error(`❌ Retry failed for ${url}:`, err);
        }
      }
    }
  }
}

runScheduledScrape();
setInterval(runScheduledScrape, FIFTEEN_MINUTES);
setInterval(retryFailedSummaries, RETRY_FAILED_EVERY);