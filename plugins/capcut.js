import axios from 'axios';

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key }
    });
  } catch (error) {
    console.error('Error enviando reacción:', error);
  }
}

const cpt = async (m, Matrix) => {
  const prefix = '/'; // o usa config.PREFIX si lo tienes
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (!['cpt', 'capcut', 'capcut-dl'].includes(cmd)) return;

  await doReact('🎥', m, Matrix);

  const args = m.body.trim().slice(prefix.length + cmd.length).trim();
  const url = args;

  if (!url || !url.startsWith('http')) {
    return Matrix.sendMessage(
      m.from,
      { 
        text: "❌ Por favor proporciona un enlace válido de *CapCut*.\n\n💡 Ejemplo: */cpt https://www.capcut.com/t/Zxxxxxxx/*" 
      },
      { quoted: m }
    );
  }

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "✨ GAWR GURA MD",
      serverMessageId: 143,
    },
  };

  try {
    const response = await axios.get(
      `https://api.diioffc.web.id/api/download/capcut?url=${encodeURIComponent(url)}`
    );
    const data = response.data;

    if (!data || data.status !== true || !data.result || !data.result.url) {
      return Matrix.sendMessage(
        m.from,
        { 
          text: "⚠️ No se pudo obtener el contenido de CapCut.\n\n🐬 Verifica el enlace e inténtalo nuevamente.",
          contextInfo: newsletterContext
        },
        { quoted: m }
      );
    }

    await Matrix.sendMessage(
      m.from,
      {
        video: { url: data.result.url },
        mimetype: "video/mp4",
        caption: `🌊🦈 *GAWR GURA MD* 🦈🌊\n\n📥 *Plantilla CapCut Descargada*\n\n🎬 *Título:* ${data.result.title}\n📏 *Tamaño:* ${data.result.size}\n\n✨ ¡Listo para editar como un tiburón pro!`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error:", error);
    await Matrix.sendMessage(
      m.from,
      { 
        text: `❌ Ocurrió un error al procesar tu solicitud.\n\n🐬 Error: ${error.message || error}`,
        contextInfo: newsletterContext
      },
      { quoted: m }
    );
  }
};

export default cpt;
