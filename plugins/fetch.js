import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("💥 Error al reaccionar:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

const fetchCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // Aliases del comando
  if (!["fetch", "get", "api", "fetchapi", "apifetch"].includes(cmd)) return;

  await doReact("🌐", m, Matrix);

  const query = body.slice(prefix.length + cmd.length).trim();

  if (!query) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ ¡Ups! Olvidaste enviarme un URL o API para consultar. Por favor intenta de nuevo 💖",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  if (!/^https?:\/\//.test(query)) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Hmm... Esto no parece un URL válido. Debe iniciar con http:// o https:// 😊",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  try {
    const { data } = await axios.get(query);
    const content = JSON.stringify(data, null, 2).slice(0, 2048);

    await Matrix.sendMessage(
      m.from,
      {
        text: `🔍 *Datos Obtenidos*:\n\`\`\`${content}\`\`\`\n\n📢 *BY GAWR GURA*`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error en el comando fetch:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ ¡Vaya! Ocurrió un error:\n${e.message}\n\n📢 *BY GAWR GURA*`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default fetchCmd;
