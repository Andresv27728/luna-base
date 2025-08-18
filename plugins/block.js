import config from '../config.cjs';

const block = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['block'];

    if (!validCommands.includes(cmd)) return;
    
    if (!isCreator) return m.reply("📛 *THIS IS AN OWNER COMMAND* 📛");

    let users = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    await gss.updateBlockStatus(users, 'block')
      .then(() => gss.sendMessage(
        m.from,
        {
          text: `✅ User *${users.split('@')[0]}* has been *BLOCKED* successfully by ✨GAWR GURA MD✨`,
          contextInfo: {
            mentionedJid: [users],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363399729727124@newsletter",
              newsletterName: "✝️ GAWR GURA MD",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      ))
      .catch((err) => gss.sendMessage(
        m.from,
        {
          text: `❌ Failed to block user: *${err}*`,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363399729727124@newsletter",
              newsletterName: "✝️ GAWR GURA MD",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      ));
  } catch (error) {
    console.error('Error:', error);
    m.reply('⚠️ An error occurred while processing the command.');
  }
};

export default block;
