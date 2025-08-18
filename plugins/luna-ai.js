import axios from "axios";
import config from "../config.cjs";

const GEMINI_API_KEY = config.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Reacción helper
async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (err) {
    console.error("Error al reaccionar:", err);
  }
}

// Contexto del newsletter GAWR GURA
const createNewsletterContext = (sender) => ({
  mentionedJid: [sender],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
});

// Comando AI
const aiCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  const supportedCmds = ["lunaai", "ai", "gemini"];
  if (!supportedCmds.includes(cmd)) return;

  await doReact("🤖", m, Matrix);

  let q = body.slice(prefix.length + cmd.length).trim();
  if (!q) {
    q = "hola luna"; // prompt por defecto
  }

  const isHansAI = cmd === "luna-ai" || cmd === "ai";
  const promptText = isHansAI
    ? `Mi nombre es ${m.pushName || "Usuario"}. Tu nombre es LUNA MD 🤖. Eres un asistente de IA amigable hecho para ayudar en WhatsApp. Siempre responde con calidez, ayuda y emojis. Mi pregunta es: ${q}`
    : q;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: [{ parts: [{ text: promptText }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "❌ No pude generar una respuesta. Intenta de nuevo más tarde.",
          contextInfo: createNewsletterContext(m.sender),
        },
        { quoted: m }
      );
    }

    await Matrix.sendMessage(
      m.from,
      {
        text: aiText,
        contextInfo: createNewsletterContext(m.sender),
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (err) {
    console.error("Error Gemini AI:", err.response?.data || err.message);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ Lo siento, ocurrió un error al contactar la IA.",
        contextInfo: createNewsletterContext(m.sender),
      },
      { quoted: m }
    );
  }
};

export default aiCmd;
