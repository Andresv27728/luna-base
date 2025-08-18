import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("Error enviando reacción:", error);
  }
}

const calc = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "calc" && cmd !== "calculate") return;

  await doReact("🧮", m, Matrix);

  const args = m.body.trim().slice(prefix.length + cmd.length).trim();
  const expression = args;

  if (!expression || !expression.trim()) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❗ Por favor proporciona una expresión matemática para calcular.\n\n💡 Ejemplo: *.calc 5*3+2*",
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
    const apiUrl = `https://apis.davidcyriltech.my.id/tools/calculate?expr=${encodeURIComponent(expression)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.success || data.result === null) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "⚠️ Expresión matemática no válida o error en el cálculo.\n\n🐬 Por favor revisa tu entrada e inténtalo de nuevo.",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    await Matrix.sendMessage(
      m.from,
      {
        text: `🌊🦈 *GAWR GURA MD* 🦈🌊\n\n📘 *Expresión:* \`${expression}\`\n\n✅ *Resultado:* ${data.result}\n\n✨ ¡Magia matemática tiburón!`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ Ocurrió un error al procesar tu solicitud.\n\n🐬 Error: ${error.message || error}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default calc;
