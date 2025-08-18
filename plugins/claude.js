import config from "../config.cjs";
import axios from "axios";

async function claude(m, Matrix) {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["claude", "claudeai", "sonnet", "ai3"].includes(cmd)) return;

  const args = body.trim().slice(prefix.length + cmd.length).trim().split(/\s+/);
  let q = args.join(" ");
  if (!q) q = "Hola, ¿cómo estás?";

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // actualizado
      newsletterName: "🌊 GAWR GURA MD 🦈",
      serverMessageId: 143,
    },
  };

  try {
    const apiUrl = `https://apis.davidcyriltech.my.id/ai/claudeSonnet?text=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.response) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "❌ *Ups...* No recibí respuesta de Claude AI.\nPor favor intenta de nuevo más tarde. 🌸",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    await Matrix.sendMessage(
      m.from,
      {
        text: `🧠 *Claude AI dice:*\n\n${data.response}\n\n🌊 _Tu amiga, GAWR GURA MD 🦈_`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error en Claude AI:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ Ocurrió un error mientras hablaba con Claude AI.\n*Detalles:* ${e.message}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
}

export default claude;
