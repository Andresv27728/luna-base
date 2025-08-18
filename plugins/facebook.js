import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (e) {
    console.error("💥 Error en la reacción:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter", // Gawr Gura
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

const fbdl = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["fbdl", "fb", "facebook"].includes(cmd)) return;

  await doReact("📥", m, Matrix);

  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  if (!q) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "🌊 ¡Hey! Envíame el enlace de un video de Facebook para poder descargarlo. 😊",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  // Validar URL de Facebook
  const fbRegex = /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/.+/i;
  if (!fbRegex.test(q)) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Ese enlace no parece válido. Por favor revisa y envíalo de nuevo. 😅",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  try {
    await Matrix.sendMessage(
      m.from,
      {
        text: "⏳ Un momento~ estoy descargando tu video de Facebook... 🧜‍♀️✨",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );

    const apiUrl = `https://suhas-bro-api.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "🙈 No pude encontrar ese video. Revisa el enlace o inténtalo más tarde.",
          contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
        },
        { quoted: m }
      );
    }

    const { thumb, title, desc, sd, hd } = data.result;
    const videoUrl = hd || sd;

    const infoMessage = `
╭─❀ FACEBOOK  ❀─╮

🌸 Título: ${title || "Sin título"}
✨ Descripción: ${desc || "Sin descripción"}

🔗 Enlace: ${q}

╰─✨ GAWR GURA ✨─╯
`.trim();

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: thumb },
        caption: infoMessage,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );

    await Matrix.sendMessage(
      m.from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: `📥 ¡Aquí está tu video de Facebook! Disfrútalo 💖\n\n— GAWR GURA`,
        fileName: `facebook_video_${Date.now()}.mp4`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al descargar Facebook:", error);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ Ups~ ocurrió un error al descargar tu video. Intenta nuevamente más tarde 🌊",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default fbdl;
