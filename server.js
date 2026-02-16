require("dotenv").config();
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const anthropic = new Anthropic();

app.use(express.json());
app.use(express.static("public"));

const STYLE_PROMPTS = {
  eminem: "Eminem's style: fast-paced, aggressive, heavy wordplay, internal rhymes, and raw emotion",
  snoop: "Snoop Dogg's style: laid-back, smooth, West Coast flow, casual and cool with slang",
  kendrick: "Kendrick Lamar's style: lyrical, deep storytelling, vivid imagery, and social commentary",
  drake: "Drake's style: emotional, melodic, catchy hooks, mix of singing and rapping",
  nicki: "Nicki Minaj's style: bold, playful, fierce, with creative punchlines and alter-ego energy",
  wayne: "Lil Wayne's style: heavy punchlines, wild metaphors, confident swagger, and clever wordplay",
};

app.post("/api/generate", async (req, res) => {
  const { name, context, style } = req.body;

  if (!name || !style) {
    return res.status(400).json({ error: "Name and style are required" });
  }

  const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS.eminem;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a rap ghostwriter. Write exactly 2 stanzas (4 lines each, separated by a blank line) about a person named "${name}". ${context ? `Here's some context about them: ${context}.` : ""}

Write in ${styleDesc}.

Rules:
- Exactly 2 stanzas, 4 lines each
- Make it fun, creative, and entertaining
- Reference the person's name and context naturally
- Keep it clean and lighthearted
- Output ONLY the rap, no titles or explanations`,
        },
      ],
    });

    res.json({ rap: message.content[0].text });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({ error: "Failed to generate rap. Check your API key." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rap generator running at http://localhost:${PORT}`));
