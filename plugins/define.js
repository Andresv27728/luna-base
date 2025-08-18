import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 Error en la reacción:", err);
  }
}

const define = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "define") return;

  await doReact("📖", m, Matrix);

  const query = m.body.trim().slice(prefix.length + cmd.length).trim();

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

  if (!query) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Por favor, proporciona una palabra para buscar.\nEjemplo: `.define amistad`",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  try {
    const url = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);

    if (!data?.list?.length) {
      await doReact("❌", m, Matrix);
      return Matrix.sendMessage(
        m.from,
        {
          text: `❌ No se encontró la palabra *${query}* en el diccionario.`,
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const firstEntry = data.list[0];
    const definition = firstEntry.definition.replace(/\[/g, "").replace(/\]/g, "");
    const example = firstEntry.example
      ? `\n\n💡 *Ejemplo:* ${firstEntry.example.replace(/\[/g, "").replace(/\]/g, "")}`
      : "";

    const decoratedMessage = `🐬╭━━━〔 *GAWR GURA DICCIONARIO* 〕━━━╮
┃📖 Palabra: ${query}
┃📝 Definición: ${definition}${example}
╰━━━━━━━━━━━━━━━━━╯
🌙 _Con cariño por Gawr Gura_
🔌 _Powered by GAWR GURA_`;

    await Matrix.sendMessage(
      m.from,
      {
        text: decoratedMessage,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (error) {
    console.error("[ERROR] comando define:", error.message);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ Oops, algo salió mal: ${error.message}\nIntenta nuevamente más tarde 🐬`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default define;
