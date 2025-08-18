import yts from 'yt-search';
import fetch from 'node-fetch';
import config from '../config.cjs';

// 🦈✨ Ayudante de reacciones (Gawr Gura Style 🌊💙)
async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("⚠️ Error en la reacción Gura:", e);
  }
}

// 🌊📩 Contexto Gawr Gura Newsletter
const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "🌊✨ GAWR GURA MD 🦈💙",
    serverMessageId: 143,
  },
};

// ⚠️ Códigos de Error 🦈
const ERROR_CODES = {
  NO_QUERY: "YT101",
  NO_RESULTS: "YT102",
  INVALID_URL: "YT201",
  API_FAILURE: "YT301",
  NETWORK_ERROR: "YT401",
  PROCESSING_FAILED: "YT501"
};

// 🎥💙 Comando de Descarga de YouTube - Gawr Gura
const youtubeVideoCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // 🦈 Respuesta decorada
  const reply = async (text, options = {}) => {
    await Matrix.sendMessage(
      m.from,
      {
        text,
        ...(options.contextInfo ? { contextInfo: options.contextInfo } : {}),
      },
      { quoted: m }
    );
  };

  // 🎥 Descargar Video de YouTube
  if (["video", "ytdl", "youtube"].includes(cmd)) {
    await doReact("🎥", m, Matrix);
    try {
      const query = body.slice(prefix.length).trim().split(" ").slice(1).join(" ");
      
      if (!query) {
        return await reply(
          `┏━━━ 🦈✨ *GAWR GURA Video Downloader* ✨🌊 ━━━┓\n\n` +
          `📺 Descarga videos de YouTube por *título o enlace* 🎬\n\n` +
          `✨ Uso:\n` +
          `• *${prefix}video tiburones divertidos*\n` +
          `• *${prefix}youtube https://youtu.be/...*\n` +
          `• *${prefix}ytdl música anime*\n\n` +
          `❌ Errores: YT1xx (Usuario), YT2xx (Entrada), YT3xx (API), YT4xx (Red), YT5xx (Proceso)\n` +
          `┗━━━━━━━━━━━━━━━━━━━━━━━┛ 🦈💙`
        );
      }

      let videoUrl = query;
      
      // 🔍 Buscar en YouTube si no es URL
      if (!query.includes('youtu.be') && !query.includes('youtube.com')) {
        await doReact("🔍", m, Matrix);
        const search = await yts(query);
        const video = search.videos[0];
        
        if (!video) {
          return await reply(
            `❌ *No encontré videos!* [${ERROR_CODES.NO_RESULTS}] 🦈💦\n\n` +
            `No pude encontrar nada para: "${query}"\n` +
            `Prueba con otras palabras mágicas 🌊✨\n` +
            `~ Tu asistente Gawr Gura 💙`
          );
        }
        videoUrl = video.url;
      }

      await doReact("⏳", m, Matrix);
      const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
      const response = await fetch(apiUrl, { timeout: 30000 });
      
      if (!response.ok) {
        throw new Error(`⚠️ Error API ${response.status} [${ERROR_CODES.API_FAILURE}]`);
      }

      const data = await response.json();
      
      if (!data.success || !data.result) {
        return await reply(
          `❌ *Falla en la API!* [${ERROR_CODES.API_FAILURE}] 🌊💦\n\n` +
          `YouTube no me dio info del video 🦈\n` +
          `Prueba con otro, quizás funciona 💙\n` +
          `~ Gawr Gura 🐟`
        );
      }

      const { title, thumbnail, video_url, audi_quality, video_quality } = data.result;
      
      const infoMsg = 
        `┏━━━ 🌊✨ *GAWR GURA encontró un Video* ✨🦈 ━━━┓\n\n` +
        `🎬 *Título:* ${title}\n` +
        `📺 *Calidad:* ${video_quality || "HD"}\n` +
        `🎧 *Audio:* ${audi_quality || "128kbps"}\n\n` +
        `📥 Descargando... ⏳\n` +
        `┗━━━━━━━━━━━━━━━━━━━━━━━┛ 💙🐟`;

      await Matrix.sendMessage(
        m.from,
        {
          image: { url: thumbnail },
          caption: infoMsg,
          contextInfo: {
            ...newsletterContext,
            mentionedJid: [m.sender]
          }
        },
        { quoted: m }
      );

      // 📺 Enviar Video
      await Matrix.sendMessage(
        m.from,
        {
          video: { url: video_url },
          mimetype: 'video/mp4',
          caption: "✨🎬 ¡Aquí tienes tu video! 🌊💙\n~ Gawr Gura 🦈",
          contextInfo: newsletterContext
        },
        { quoted: m }
      );

      // 📁 Enviar como Documento
      await Matrix.sendMessage(
        m.from,
        {
          document: { url: video_url },
          mimetype: 'video/mp4',
          fileName: `${title.replace(/[^\w\s]/gi, '')}.mp4`,
          caption: "📁💾 *Video como archivo* 🌊✨\nDisfrútalo con Gawr Gura 🦈💙",
          contextInfo: newsletterContext
        },
        { quoted: m }
      );

      await doReact("✅", m, Matrix);

    } catch (e) {
      console.error("🐟 Error en video:", e);
      const errorCode = e.message.includes("API Error") ? ERROR_CODES.API_FAILURE : 
                        e.message.includes("timed out") ? ERROR_CODES.NETWORK_ERROR : 
                        ERROR_CODES.PROCESSING_FAILED;
      
      await reply(
        `❌ *No se pudo descargar* [${errorCode}] 🌊💦\n\n` +
        `⚠️ Error: _${e.message || "Desconocido"}_\n\n` +
        `Inténtalo otra vez o contacta soporte con el código 💙\n` +
        `~ Gawr Gura 🦈`
      );
    }
    return;
  }

  // 🎬 YouTube URL a MP4
  if (["ytmp4", "ytvid", "youtubevid"].includes(cmd)) {
    await doReact("🎬", m, Matrix);
    try {
      const url = body.slice(prefix.length).trim().split(" ").slice(1).join(" ");
      
      if (!url || !(url.includes("youtube.com/watch") || url.includes("youtu.be/"))) {
        return await reply(
          `┏━━━ 🌊 *Convertir YouTube a MP4* 🦈 ━━━┓\n\n` +
          `🔗 Convierte enlaces en archivos de video 🎬✨\n\n` +
          `Uso:\n` +
          `• *${prefix}ytmp4 https://youtube.com/watch?v=...*\n` +
          `• *${prefix}ytvid https://youtu.be/...*\n\n` +
          `Errores: YT1xx, YT2xx, YT3xx, YT4xx, YT5xx\n` +
          `┗━━━━━━━━━━━━━━━━━━━━━━━┛ 💙`
        );
      }

      await doReact("⏳", m, Matrix);
      const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl, { timeout: 30000 });
      
      if (!response.ok) {
        throw new Error(`Error API ${response.status} [${ERROR_CODES.API_FAILURE}]`);
      }

      const data = await response.json();
      
      if (!data.success || !data.result) {
        return await reply(
          `❌ *Falla en la API!* [${ERROR_CODES.API_FAILURE}] 🌊\n\n` +
          `YouTube no dio respuesta 🦈💦\n` +
          `Intenta con otro URL 💙\n` +
          `~ Gawr Gura`
        );
      }

      const { title, thumbnail, video_url, audi_quality, video_quality } = data.result;
      
      const infoMsg = 
        `✨ *Descarga de YouTube* 📥\n\n` +
        `🎬 *Título:* ${title}\n` +
        `📺 *Calidad:* ${video_quality || "HD"}\n` +
        `🎧 *Audio:* ${audi_quality || "128kbps"}\n\n` +
        `⏳ Descargando...`;

      await Matrix.sendMessage(
        m.from,
        {
          image: { url: thumbnail },
          caption: infoMsg,
          contextInfo: {
            ...newsletterContext,
            mentionedJid: [m.sender]
          }
        },
        { quoted: m }
      );

      // 🎬 Enviar Video
      await Matrix.sendMessage(
        m.from,
        {
          video: { url: video_url },
          mimetype: 'video/mp4',
          caption: "🎥🌊 ¡Aquí está tu video! 💙🦈\n~ Gawr Gura",
          contextInfo: newsletterContext
        },
        { quoted: m }
      );

      // 📁 Enviar Documento
      await Matrix.sendMessage(
        m.from,
        {
          document: { url: video_url },
          mimetype: 'video/mp4',
          fileName: `${title.replace(/[^\w\s]/gi, '')}.mp4`,
          caption: "📂✨ Video entregado como archivo 💙🦈",
          contextInfo: newsletterContext
        },
        { quoted: m }
      );

      await doReact("✅", m, Matrix);

    } catch (e) {
      console.error("Error YTMP4:", e);
      const errorCode = e.message.includes("API Error") ? ERROR_CODES.API_FAILURE : 
                        e.message.includes("timed out") ? ERROR_CODES.NETWORK_ERROR : 
                        ERROR_CODES.PROCESSING_FAILED;
      
      await reply(
        `❌ *Descarga Fallida!* [${errorCode}] 🌊\n\n` +
        `Error: _${e.message || "URL inválida o API caída"}_\n` +
        `Verifica el enlace 🦈💙\n` +
        `~ Gawr Gura`
      );
    }
    return;
  }
};

export default youtubeVideoCmd;
