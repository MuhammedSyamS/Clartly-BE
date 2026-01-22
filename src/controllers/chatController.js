// src/controllers/chatController.js
const OpenAI = require("openai");

// Make sure API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "No message sent" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 300, // optional: limit response length
    });

    const reply =
      completion.choices?.[0]?.message?.content || "Sorry, I didn't get that.";

    res.json({ reply });
  } catch (err) {
    console.error("ChatController Error:", err);
    res.status(500).json({ reply: "AI service error" });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No message sent" });

    // Mock response for testing
    const reply = `You said: "${message}". (Mock response)`;

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI service error" });
  }
};

