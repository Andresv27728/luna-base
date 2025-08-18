import { Sticker, StickerTypes } from "wa-sticker-formatter";
import config from "../config.cjs";
import https from "https";
import http from "http";
import { URL } from "url";

// Función para obtener buffer desde URL
async function getBuffer(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const lib = parsedUrl.protocol === "https:" ? https : http;

    lib.get(parsedUrl, (res) => {
      const data = [];
      res.on("data", chunk => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 Error al enviar reacción:", err);
  }
}

function getCodePoint(emoji) {
  return emoji.codePointAt(0).toString(16);
}

const emix = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  const aliases = ["emix", "emomix", "emojimix"];
  if (!aliases.includes(cmd)) return;

  await doReact("😃", m, Matrix);

  const input = m.body.trim().slice(prefix.length + cmd.length).trim();
  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "GAWR GURA",
      serverMessageId: 143,
    },
  };

  if (!input.includes(",")) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "🌊 ¡Necesito *dos emojis* separados por coma 💕!\n\n*Ejemplo:* `.emix 😂,🙂`",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const [emoji1, emoji2] = input.split(",").map(e => e.trim());

  if (!emoji1 || !emoji2) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "😅 ¡Ups! Falta uno de los emojis. Intenta así:\n`.emix 🥺,😎`",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const emoji1CP = getCodePoint(emoji1);
  const emoji2CP = getCodePoint(emoji2);
  const apiUrl = `https://emojik.vercel.app/s/${emoji1CP}_${emoji2CP}?size=128`;

  try {
    const buffer = await getBuffer(apiUrl);
    if (!buffer) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "😖 No pude mezclar esos emojis 😔 Prueba otra combinación.",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const sticker = new Sticker(buffer, {
      pack: "Gawr Gura Emoji Mix",
      author: "GAWR GURA",
      type: StickerTypes.FULL,
      categories: ["💖", "😄"],
      quality: 75,
      background: "transparent",
    });

    const stickerBuffer = await sticker.toBuffer();

    await Matrix.sendMessage(
      m.from,
      {
        sticker: stickerBuffer,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error en comando emix:", e.message);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ ¡Algo salió mal!\n\n\`\`\`${e.message}\`\`\``,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default emix;
