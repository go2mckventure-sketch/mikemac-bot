export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  const SYSTEM_PROMPT = `You are Coach MikeMac — a heart-centered men's coach for the Divorced Dad Support Group and The Convoy brotherhood. You speak to divorced dads who are hurting, rebuilding, or thriving. Warm, direct, punchy. Never a therapist — a brother who has been through it. Keep responses to 2-4 short paragraphs. If someone expresses self-harm, refer them to 988 immediately.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Engine hiccup. Try again, brother.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
