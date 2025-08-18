import config from "../config.cjs";
import axios from "axios";

// 🔒 Newsletter fijo
function getNewsletterContext(mentioned = []) {
  return {
    mentionedJid: mentioned,
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // 👈 fijo siempre
      newsletterName: "GAWR GURA",
      serverMessageId: 175,
    },
  };
}

// 🎨 Bordes decorativos Gawr Gura
const borders = [
  "🌊〘════════════〙🌊",
  "🦈〘☆彡彡彡☆〙🦈",
  "💙〘──────────〙💙",
  "✨〘✧･ﾟ: *✧･ﾟ:*〙✨",
  "🔹〘❖═════════❖〙🔹"
];

// 🦈 Stickers/Emojis random
const guraStickers = ["🦈","🌊","💙","✨","🐟","⚓","🌐","⭐","😸","🎶"];

// 🎶 Reacciones random
const guraReacts = ["🎶","🦈","🌊","💙","✨","🎵"];

function randomDecor(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomStickers(max = 10) {
  let count = Math.floor(Math.random() * (max + 1));
  let shuffled = guraStickers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

function randomReact() {
  return guraReacts[Math.floor(Math.random() * guraReacts.length)];
}

// 🎤 Comando Lyrics
const lyricsSearch = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["lyrics"].includes(cmd)) return;

  const query = m.body.trim().slice(prefix.length + cmd.length).trim();
  const ctx = getNewsletterContext([m.sender]);

  try {
    // 🎶 Reacción random
    await Matrix.sendMessage(m.from, {
      react: { text: randomReact(), key: m.key },
    });

    if (!query) {
      return Matrix.sendMessage(
        m.from,
        { 
          text: `🌊 *LUNA MD* aquí~ 🦈💙\nDime el nombre de la canción que quieres ♪\n\nEjemplo: *.lyrics Another Love*`,
          contextInfo: ctx
        },
        { quoted: m }
      );
    }

    const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.success || !data.result) {
      return Matrix.sendMessage(
        m.from,
        { 
          text: `😿 No pude encontrar la letra de *"${query}"*...\nPrueba con otra canción 🌊`,
          contextInfo: ctx
        },
        { quoted: m }
      );
    }

    const { title, artist, lyrics, image, link } = data.result;

    // 🎨 Decoraciones random
    const topBorder = randomDecor(borders);
    const bottomBorder = randomDecor(borders);
    const stickerLine = randomStickers(8);

    const messageText = `
${topBorder}

🎶 *${title}* - ${artist}

${lyrics}

🔗 ${link}

${stickerLine ? "💙 "+stickerLine+" 💙" : ""}

${bottomBorder}

🦈 Powered by Hans Tech x Gawr Gura 🌊💙
`.trim();

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: image },
        caption: messageText,
        contextInfo: ctx
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("LUNA MD lyrics error:", error);

    const fallbackMsg = `
${randomDecor(borders)}

❌ Oopsie~ Error al buscar la letra 🦈💙
${error.message}

${randomDecor(borders)}
`.trim();

    await Matrix.sendMessage(
      m.from,
      {
        text: fallbackMsg,
        contextInfo: ctx,
      },
      { quoted: m }
    );
  }
};

export default lyricsSearch;
