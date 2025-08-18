import yts from 'yt-search';
import fetch from 'node-fetch';
import config from '../config.cjs';

// 🎭 Reaction helper
async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("Reaction error:", e);
  }
}

// 🎀 Newsletter context fijo
const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter", // fijo
    newsletterName: "𝐆𝐀𝐖𝐑 𝐆𝐔𝐑𝐀",
    serverMessageId: 143,
  },
};

// 🎵 YouTube Command Handler
const youtubeCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // 🎤 Helper para responder
  const reply = async (text, options = {}) => {
    await Matrix.sendMessage(
      m.from,
      {
        text: text.replace(/LUNA/gi, "GAWR GURA"), // 🔄 reemplazo automático
        ...(options.contextInfo ? { contextInfo: options.contextInfo } : {}),
      },
      { quoted: m }
    );
  };

  // 🎶 PLAY
  if (["play", "ytsong", "song", "music"].includes(cmd)) {
    await doReact("🎵", m, Matrix);
    try {
      const query = body.slice(prefix.length).trim().split(" ").slice(1).join(" ");
      if (!query) {
        return await reply(
          "✨ *GAWR GURA's Music Player* 🎧\n\n" +
          "Dime el nombre de una canción y la busco por ti~ 🦈💙\n\n" +
          "📌 Ejemplo:\n" +
          `• *${prefix}play Dandelions*\n` +
          `• *${prefix}song Shape of You*`
        );
      }

      await doReact("🔍", m, Matrix);
      const search = await yts(query);
      const video = search.videos[0];
      if (!video) {
        return await reply(
          `❌ No encontré nada para "${query}" 😢\n\n` +
          "Intenta con otro nombre de canción, senpai~ 🦈"
        );
      }

      const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`;
      const apiRes = await fetch(apiUrl);
      const json = await apiRes.json();
      if (!json.success || !json.result?.download_url) throw new Error("No se pudo obtener el link de descarga");

      const infoMsg =
        `✨ *GAWR GURA encontró tu canción* 🎶\n\n` +
        `🎵 *Título:* ${video.title}\n` +
        `👤 *Artista:* ${video.author.name}\n` +
        `⏱️ *Duración:* ${video.timestamp}\n` +
        `👁️ *Vistas:* ${video.views.toLocaleString()}\n\n` +
        "Preparando el audio... ⏳";

      await Matrix.sendMessage(
        m.from,
        {
          image: { url: video.thumbnail },
          caption: infoMsg,
          contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
        },
        { quoted: m }
      );

      // 🎼 Como audio
      await Matrix.sendMessage(
        m.from,
        {
          audio: { url: json.result.download_url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title.replace(/[^\w\s]/gi, '')}.mp3`,
          caption: "🌊 *Disfruta tu música, senpai!* 🦈💙\n~ GAWR GURA",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );

      // 📁 Como documento
      await Matrix.sendMessage(
        m.from,
        {
          document: { url: json.result.download_url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title.replace(/[^\w\s]/gi, '')}.mp3`,
          caption: "📂 Aquí tienes tu canción como archivo 💾\n~ GAWR GURA 🌊",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );

      await doReact("✅", m, Matrix);
    } catch (e) {
      console.error("Play error:", e);
      await reply(
        "❌ *Oh no!* 🥺\n\n" +
        `Error: ${e.message || "Fallo en la descarga"}\n\n` +
        "Intenta con otra canción~ 💙"
      );
    }
    return;
  }

  // 🔎 YTSEARCH
  if (["ytsearch", "yts", "ytsrc"].includes(cmd)) {
    await doReact("🔎", m, Matrix);
    try {
      const query = body.slice(prefix.length).trim().split(" ").slice(1).join(" ");
      if (!query) {
        return await reply(
          "✨ *GAWR GURA YouTube Search* 🔎\n\n" +
          "Dime qué canción o video buscar~ 🦈💙"
        );
      }

      const search = await yts(query);
      if (!search || !search.videos.length) {
        return await reply(`❌ No encontré resultados para "${query}" 😢`);
      }

      let results = `🌊 *GAWR GURA YouTube Search* 🦈\n\n`;
      for (let i = 0; i < Math.min(search.videos.length, 5); i++) {
        const v = search.videos[i];
        results += `🎵 *${v.title}*\n👤 ${v.author.name}\n⏱️ ${v.timestamp}\n🔗 ${v.url}\n\n`;
      }

      await Matrix.sendMessage(
        m.from,
        { text: results, contextInfo: newsletterContext },
        { quoted: m }
      );
      await doReact("✅", m, Matrix);
    } catch (e) {
      console.error("YTSearch error:", e);
      await reply("❌ Error en la búsqueda de YouTube 😢");
    }
    return;
  }

  // 🎧 YTMP3
  if (["ytmp3", "ytaudio"].includes(cmd)) {
    await doReact("🎶", m, Matrix);
    try {
      const url = body.slice(prefix.length).trim().split(" ")[1];
      if (!url || !url.includes("youtube.com")) {
        return await reply("❌ Debes darme un link válido de YouTube 🎥");
      }

      const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(url)}`;
      const apiRes = await fetch(apiUrl);
      const json = await apiRes.json();
      if (!json.success || !json.result?.download_url) throw new Error("Error al procesar link");

      await Matrix.sendMessage(
        m.from,
        {
          audio: { url: json.result.download_url },
          mimetype: 'audio/mpeg',
          fileName: "gawr-gura-song.mp3",
          caption: "✨ Aquí tienes tu audio 🎶\n~ GAWR GURA 🌊🦈",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );

      await doReact("✅", m, Matrix);
    } catch (e) {
      console.error("YTMP3 error:", e);
      await reply("❌ No pude descargar el audio 😢");
    }
    return;
  }
};

export default youtubeCmd;
