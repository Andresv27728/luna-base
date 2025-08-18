// 🌊🦈 𓆩★𓆪 Código mágico con temática GAWR GURA 𓆩★𓆪 🦈🌊
// ─────────────────────────────────────────────
// ✨ Bañado en burbujas, olitas y sonrisas de tiburoncita 💙
import pkg from "darksadasyt-anime";
const { search, getep } = pkg;

import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("❌ Error enviando reacción de burbujitas:", error);
  }
}

// 🦈⚡ Función principal con poderes de Gura
const anime = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "anime") return;

  // 💙 Reacciona con el emoji místico de Gawr Gura 🎭
  await doReact("🎭", m, Matrix);

  // 🌊 Extraer la búsqueda del usuario
  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  // 🎐 Decoración GAWR GURA para los contextos
  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // ✅ cambiado como pediste
      newsletterName: "🌊💙 𝐆𝐀𝐖𝐑 𝐆𝐔𝐑𝐀 𝐌𝐃 💙🦈",
      serverMessageId: 143,
    },
  };

  try {
    if (!q) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "🦈✨ *Por favor escribe el nombre de un anime, kouhai~* 🎭",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    // 🌐 Buscar animes
    const results = await search(q);
    if (!results || results.length === 0) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "❌ Ningún anime encontrado con ese nombre… Gura dice: inténtalo otra vez 🌊",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    // 🐠 Resultado inicial con bordes kawaii
    let animeList =
      "╭━━━〔 🎬 *GAWR GURA ANIME SEARCH* 🎬 〕━━━⊷\n" +
      "┃ ✨ Usa `.andl <link>` para descargar episodio ✨\n\n";

    results.forEach((anime, index) => {
      animeList += `┃ ${index + 1}. ${anime.title}\n┃ 🔗 ${anime.link}\n`;
    });

    animeList += "╰━━━━━━━━━━━━━━━━━━━━━⪼ 🦈💙\n";

    await Matrix.sendMessage(
      m.from,
      {
        text: animeList,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    // 🎐 Usar primer resultado para episodios
    const animeLink = results[0].link;
    const baseUrl = new URL(animeLink).origin;

    const episodeData = await getep(animeLink);

    if (!episodeData || !episodeData.result || !episodeData.results) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "⚠️ No se pudieron recuperar los episodios, Gura está dormidita... 😴",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    // 💙 Lista de episodios decorada
    let episodeList = `╭━━━〔 📺 *Episodios de:* ${episodeData.result.title} 📺 〕━━━⊷\n\n`;
    episodeData.results.forEach((episode) => {
      const fullEpisodeUrl = new URL(episode.url, baseUrl).href;
      episodeList += `┃ 🐬 Episodio ${episode.episode} ➜ ${fullEpisodeUrl}\n`;
    });
    episodeList += "╰━━━━━━━━━━━━━━━━━━━━━⪼ 🌊🦈✨\n";

    await Matrix.sendMessage(
      m.from,
      {
        text: episodeList,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ Error inesperado: ${e.message}\n🌊 Gura está mordiéndose los cables...`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default anime;

// 🌊✨ Random Stickers (se agregan aleatoriamente):
// 🦈💙 (っ◔◡◔)っ ♥ Gura hug ♥
// 🌊✨ Shrimps unite! ✨🌊
// 🐠💫 Kon~aqua pero versión shark!
// 🧋🍰 Gura se roba tu comida kawaii~
// 🎐💙 Hola hola! Aquí tu tiburoncita favorita
