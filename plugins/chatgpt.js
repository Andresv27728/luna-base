import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 Error al enviar reacción:", err);
  }
}

const gpt = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["gpt", "chatgpt", "ai"].includes(cmd)) return;
  await doReact("🤖", m, Matrix);

  const query = m.body.trim().slice(prefix.length + cmd.length).trim();

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // tu newsletter
      newsletterName: "🌊 GAWR GURA MD 🦈",
      serverMessageId: 160,
    },
  };

  if (!query) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "💬 *GAWR GURA MD* dice: ¡Escribe algo para que pueda pensarlo! 🧠\n\n📌 Ejemplo: `.gpt ¿Cuál es la capital de Japón?`",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  try {
    await Matrix.sendPresenceUpdate("composing", m.from);

    const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl);

    if (!res.data || !res.data.result) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "😓 *GAWR GURA MD* no pudo obtener una respuesta del servidor de IA.\n🌐 Intenta de nuevo más tarde.",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const aiText = `╭━━━〔 🌊 *GAWR GURA AI* 🦈 〕━━━┈⊷\n\n💡 ${res.data.result}\n\n╰───────────────────────────⊷\n🐬 _Tu amiga, GAWR GURA MD_\n🔌 _Powered by HANS TECH_`;

    await Matrix.sendMessage(
      m.from,
      {
        text: aiText,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("GPT error:", error);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ *Ups...* Hubo un problema al conectar con la IA.\nPor favor intenta de nuevo más tarde 🦈🤍",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } finally {
    await Matrix.sendPresenceUpdate("paused", m.from);
  }
};

export default gpt;
