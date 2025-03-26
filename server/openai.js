const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizePolicy(text) {
  const prompt = `Summarize this privacy policy. Focus on what data is collected, how it's used, and any user permissions involved:\n\n${text}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = summarizePolicy;
