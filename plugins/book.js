import config from '../config.cjs';

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key }
    });
  } catch (error) {
    console.error('Error sending reaction:', error);
  }
}

const book = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'book') return;

  await doReact('📘', m, Matrix);

  const args = m.body.trim().slice(prefix.length + cmd.length).trim().split(/\s+/);
  const text = args.join(' ');

  if (!text) {
    return Matrix.sendMessage(
      m.from,
      { 
        text: "🌊🐬 *Oops! Little Sharky, please provide some text.*\n\n✨ Example: `.book Gura`",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363399729727124@newsletter",
            newsletterName: "✨ GAWR GURA MD",
            serverMessageId: 143,
          },
        },
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
    const url = `https://apis.davidcyriltech.my.id/generate/book?text=${encodeURIComponent(text)}&size=35`;

    await Matrix.sendMessage(
      m.from,
      {
        image: { url },
        caption: `📘✨ *Book generated for:* 「 ${text} 」\n\n🌊🐟 Powered by *GAWR GURA MD* 🦈`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await Matrix.sendMessage(
      m.from,
      { 
        text: `⚠️ Oopsie! Error: ${e.message || e}\n\n🐬 Please try again later, little Sharky~`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default book;
