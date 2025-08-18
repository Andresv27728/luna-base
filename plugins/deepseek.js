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

const deepseek = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["deepseek", "dpseek", "ai2"].includes(cmd)) return;

  await doReact("⏳", m, Matrix); // reacción mientras procesa

  const q = m.body.trim().slice(prefix.length + cmd.length).trim() || "Hola";

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

  try {
    const apiUrl = `https://apis.davidcyriltech.my.id/ai/deepseek-r1?text=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.response) {
      await doReact("❌", m, Matrix);
      return Matrix.sendMessage(
        m.from,
        {
          text: `❌ *¡Oh no!* Gawr Gura no pudo obtener respuesta 🤯\nIntenta de nuevo con otra pregunta.`,
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    // Mensaje decorado estilo Gawr Gura
    const decoratedText = `🐬╭━━━〔 *GAWR GURA AI* 〕━━━╮
┃💬 Pregunta: ${q}
┃🤖 Respuesta:
┃${data.response}
╰━━━━━━━━━━━━━━━━━╯
🌙 _Con amor y diversión por Gawr Gura_
🔌 _Powered by GAWR GURA_`;

    await Matrix.sendMessage(
      m.from,
      {
        text: decoratedText,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix); // éxito
  } catch (e) {
    console.error("Error en deepseek:", e.message);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ *¡Oops!* Algo salió mal: ${e.message}\nGawr Gura dice: intenta más tarde 🐬`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default deepseek;
