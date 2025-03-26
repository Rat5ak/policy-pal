const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizePolicy(text) {
  // Hard truncate to avoid going over 128k token limit (GPT-4o)
  const maxCharLength = 300000; // safe for 100k tokens (GPT-4o sweet spot)
  const safeText = text.length > maxCharLength ? text.slice(0, maxCharLength) : text;

  const prompt = `Summarize this privacy policy. Focus on what data is collected, how it's used, and any user permissions involved:\n\n${safeText}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 16384, // generous output limit
  });

  return response.choices[0].message.content;
}

module.exports = summarizePolicy;
