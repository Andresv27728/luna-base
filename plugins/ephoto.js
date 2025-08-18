import config from "../config.cjs";
import axios from "axios";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (e) {
    console.error("💥 Error en la reacción:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

const ephoto = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["ephoto", "ephoto360", "photoeffect", "textstyle"].includes(cmd)) return;

  await doReact("🎨", m, Matrix);

  const inputText = m.body.trim().slice(prefix.length + cmd.length).trim();
  const ctx = { ...newsletterContext, mentionedJid: [m.sender] };

  if (!inputText) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "✏️ ¡Hola! Por favor escribe un texto para crear tu imagen con estilo.\n\n*Ejemplo:* `.ephoto hola`",
        contextInfo: ctx,
      },
      { quoted: m }
    );
  }

  const effects = [
    { number: "1", name: "Logo Maker", endpoint: "logomaker" },
    { number: "2", name: "Brillo Avanzado", endpoint: "advancedglow" },
    { number: "3", name: "Escribir Texto", endpoint: "writetext" },
    { number: "4", name: "Texto Glitch", endpoint: "glitchtext" },
    { number: "5", name: "Pixel Glitch", endpoint: "pixelglitch" },
    { number: "6", name: "Neón Glitch", endpoint: "neonglitch" },
    { number: "7", name: "Texto con Bandera", endpoint: "flagtext" },
    { number: "8", name: "Texto 3D con Bandera", endpoint: "flag3dtext" },
    { number: "9", name: "Borrando Texto", endpoint: "deletingtext" },
    { number: "10", name: "Arena de Verano", endpoint: "sandsummer" },
    { number: "11", name: "Creando Neón", endpoint: "makingneon" },
    { number: "12", name: "Texto Real", endpoint: "royaltext" },
  ];

  // Menú de efectos
  let menu = "╭━━━〔 *MODELOS Ephoto360* 〕━━━⊷\n";
  effects.forEach((e) => (menu += `┃▸ ${e.number}. ${e.name}\n`));
  menu += "╰━━━⪼\n\n📌 Responde con el número para elegir un efecto.";

  await Matrix.sendMessage(m.from, { text: menu, contextInfo: ctx }, { quoted: m });

  let active = true;

  // Cancelar espera después de 2 minutos
  const timeout = setTimeout(() => {
    active = false;
  }, 120000);

  // Listener para la respuesta del usuario
  Matrix.ev.on("messages.upsert", async (msgData) => {
    if (!active) return;
    const recv = msgData.messages[0];
    if (!recv.message || recv.key.fromMe) return;
    if (recv.key.remoteJid !== m.from) return;

    const text =
      recv.message.conversation || recv.message.extendedTextMessage?.text;
    if (!text) return;

    const effect = effects.find((e) => e.number === text.trim());
    if (!effect) return;

    active = false;
    clearTimeout(timeout);

    try {
      await Matrix.sendMessage(
        m.from,
        { react: { text: "⬇️", key: recv.key }, contextInfo: ctx },
        { quoted: recv }
      );
      await Matrix.sendPresenceUpdate("recording", m.from);

      await Matrix.sendMessage(
        m.from,
        {
          text: `🖌️ Generando *${effect.name}*...`,
          contextInfo: ctx,
        },
        { quoted: recv }
      );

      const apiUrl = `https://vapis.my.id/api/${effect.endpoint}?q=${encodeURIComponent(
        inputText
      )}`;

      await Matrix.sendMessage(
        m.from,
        {
          image: { url: apiUrl },
          caption: `✅ ¡*${effect.name}* generado con éxito! 🌊`,
          contextInfo: ctx,
        },
        { quoted: recv }
      );

      await Matrix.sendPresenceUpdate("recording", m.from);
    } catch (err) {
      console.error("Error en API:", err);
      await Matrix.sendMessage(
        m.from,
        {
          text: `❌ No se pudo generar la imagen: ${err.message}`,
          contextInfo: ctx,
        },
        { quoted: recv }
      );
    }
  });
};

export default ephoto;
