const express = require("express");
const cors = require("cors");
require("dotenv").config();

const summarizePolicy = require("./openai");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const dummyText = "We collect your microphone, camera, and soul. Thank you.";
  const summary = await summarizePolicy(dummyText);
  res.send(summary);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
