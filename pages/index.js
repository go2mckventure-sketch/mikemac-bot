import { useState, useRef, useEffect } from "react";

const STARTERS = [
  "I just found out about my divorce. I don't know what to do.",
  "I'm struggling to stay connected with my kids.",
  "I'm ready to rebuild. Where do I start?",
  "Tell me about The Convoy brotherhood.",
];

export default function CoachBot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey brother. You found the right cab. 🚛\n\nI'm Coach MikeMac's AI co-pilot. Here 24/7 for the moments when the road gets dark.\n\nNo judgment. No sales pitch. Just a straight conversation.\n\nWhere are you right now?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Engine hiccup. Try again, brother." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0A0A0A", color: "#F0EDE6", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ background: "#0F0F0F", padding: "14px 20px", borderBottom: "1px solid #1C1C1C" }}>
        <div style={{ fontWeight: 800, fontSize: "18px", color: "#FFD000", letterSpacing: "0.1em" }}>COACH MIKEMAC</div>
        <div style={{ fontSize: "12px", color: "#666" }}>Divorced Dad Support · The Convoy</div>
      </div>
      <div style={{ height: "3px", background: "repeating-linear-gradient(90deg,#FFD000 0,#FFD000 28px,transparent 28px,transparent 46px)" }} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ background: m.role === "user" ? "#FFD000" : "#141414", color: m.role === "user" ? "#111" : "#EEE", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "12px 15px", maxWidth: "80%", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-wrap", border: m.role === "assistant" ? "1px solid #242424" : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#FFD000", fontSize: "20px" }}>•••</div>}
        <div ref={bottomRef} />
      </div>
      {messages.length === 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "0 16px 12px" }}>
          {STARTERS.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ background: "transparent", border: "1px solid #2A2A2A", color: "#AAA", borderRadius: "20px", padding: "7px 13px", fontSize: "12px", cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      )}
      <div style={{ height: "3px", background: "repeating-linear-gradient(90deg,#FFD000 0,#FFD000 28px,transparent 28px,transparent 46px)" }} />
      <div style={{ display: "flex", gap: "10px", padding: "12px 14px", background: "#0F0F0F" }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}} placeholder="Talk to Coach MikeMac..." rows={2} style={{ flex: 1, background: "#161616", border: "1px solid #2A2A2A", borderRadius: "10px", color: "#F0EDE6", fontSize: "15px", padding: "9px 13px", resize: "none", outline: "none", fontFamily: "sans-serif" }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#FFD000", border: "none", cursor: "pointer", fontSize: "20px" }}>→</button>
      </div>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#444", padding: "8px 16px 14px" }}>
        AI support only. In crisis? Call or text <strong style={{ color: "#FFD000" }}>988</strong>.
      </div>
    </div>
  );
}
