import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 Error al reaccionar:", err);
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

const epdownload = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  const aliases = ["epdownload", "epdl"];
  if (!aliases.includes(cmd)) return;

  await doReact("🥺", m, Matrix); // Reacción tímida de GAWR GURA

  const url = m.body.trim().slice(prefix.length + cmd.length).trim();
  if (!url) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "Umm... olvidaste darme un enlace 🥺\n*Uso:* `.epdownload <enlace>`",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  if (!url.includes("eporner.com")) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "Eurk! 😖 Esto no parece un enlace de Eporner...\nGAWR GURA no acepta URLs rotas.",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  try {
    const apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/download?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.download_link) {
      return Matrix.sendMessage(
        m.from,
        { 
          text: "I-I no pude encontrar el enlace de descarga... ¡lo siento! 😔",
          contextInfo: { ...newsletterContext, mentionedJid: [m.sender] }
        },
        { quoted: m }
      );
    }

    const message = `*🎥 Umm... aquí tienes tu video...*\n\n🔗 *Enlace:* ${data.download_link}\n\n💖 Trátalo con cuidado, eh... 😳`;

    await Matrix.sendMessage(
      m.from,
      {
        text: message,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("Error en EPDownload:", err.message);
    await Matrix.sendMessage(
      m.from,
      {
        text: `Algo salió mal... GAWR GURA está demasiado tímida para manejar esto 😣\n\`\`\`${err.message}\`\`\``,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default epdownload;
