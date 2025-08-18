import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("Error sending reaction:", error);
  }
}

const bible = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "bible") return;

  await doReact("✝️", m, Matrix);

  const args = m.body.trim().slice(prefix.length + cmd.length).trim().split(/\s+/);
  const reference = args.join(" ");

  if (!reference || reference.trim() === "") {
    return Matrix.sendMessage(
      m.from,
      {
        text: 
`╔══✦•✦══╗
🙏 *Hijo de Dios*  
Por favor proporciona una referencia bíblica.  
Ejemplo: *Juan 3:16*  
╚══✦•✦══╝`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363399729727124@newsletter",
            newsletterName: "GAWR GURA",
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );
  }

  try {
    const url = `https://apis.davidcyriltech.my.id/bible?reference=${encodeURIComponent(reference)}`;
    const response = await axios.get(url);
    const res = response.data;

    if (res && res.success) {
      const message = 
`╔══✦•📖•✦══╗
✝️ *Palabra de Dios:* ${res.reference} ✝️
╚══✦•📖•✦══╝

📖 *Traducción:* ${res.translation}  
📜 *Versículos:* ${res.verses_count}  

✨ *Escritura:*  
${res.text.trim()}

🕊️ *Reflexiona sobre estas palabras.* 🙌`;

      await Matrix.sendMessage(
        m.from,
        {
          text: message,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363399729727124@newsletter",
