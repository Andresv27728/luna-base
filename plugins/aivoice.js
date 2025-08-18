// 🌊💙𓆝𓆟𓆞𓆝𓆟𓆞𓆝 GAWRTASTIC CODE DECORATOR 🦈💙 //
// ✨ Código decorado con temática de Gawr Gura ✨ //

import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("⚠️ Error enviando reacción Gura:", error);
  }
}

const aivoice = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // 🔹 Alias permitidos con poder de Gawr Gura 🌊
  if (!["aivoice", "vai", "voicex", "voiceai"].includes(cmd)) return;

  // 🦈 Reacción fija: búmeran kawaii 🪃
  await doReact("🪃", m, Matrix);

  const args = m.body.trim().slice(prefix.length + cmd.length).trim().split(/\s+/);

  if (args.length === 0 || !args[0]) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "⚠️ ¡Debes escribir un texto después del comando!\n🌊 Ejemplo: .aivoice hola mundo 💙",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363399729727124@newsletter",
            newsletterName: "🌊💙 𝐆𝐀𝐖𝐑 𝐆𝐔𝐑𝐀 𝐌𝐃 💙🌊",
            serverMessageId: 150,
          },
        },
      },
      { quoted: m }
    );
  }

  const inputText = args.join(" ");

  // 🎶 Modelos de voz disponibles (powered by Shark Energy 🦈✨)
  const voiceModels = [
    { number: "1", name: "Hatsune Miku 🎤", model: "miku" },
    { number: "2", name: "Nahida (Exclusiva) ✨", model: "nahida" },
    { number: "3", name: "Nami 🌊", model: "nami" },
    { number: "4", name: "Ana (Femenina) 💃", model: "ana" },
    { number: "5", name: "Optimus Prime 🤖", model: "optimus_prime" },
    { number: "6", name: "Goku 🐉", model: "goku" },
    { number: "7", name: "Taylor Swift 🎶", model: "taylor_swift" },
    { number: "8", name: "Elon Musk 🚀", model: "elon_musk" },
    { number: "9", name: "Mickey Mouse 🐭", model: "mickey_mouse" },
    { number: "10", name: "Kendrick Lamar 🎤", model: "kendrick_lamar" },
    { number: "11", name: "Angela Adkinsh 🎼", model: "angela_adkinsh" },
    { number: "12", name: "Eminem 🔥", model: "eminem" },
  ];

  // 🦈 Bordes decorativos random estilo Gura
  const borders = [
    "╭━━━━𓆉𓆝𓆟━━━━⊷",
    "︵‿︵‿୨♡୧‿︵‿︵",
    "｡･ﾟﾟ･💙･ﾟﾟ･｡",
    "☆*:・ﾟ𓆉・:*☆",
    "🌊⋆ ˚｡⋆୨୧˚"
  ];
  const randomBorder = borders[Math.floor(Math.random() * borders.length)];

  let menuText = `${randomBorder}\n   🌊 *MODELOS DE VOZ AI* 🦈\n${randomBorder}\n`;
  voiceModels.forEach((model) => {
    menuText += `┃▸ ${model.number}. ${model.name}\n`;
  });
  menuText += "╰━━━⪼\n\n";
  menuText += `📌 *Responde con el número para elegir un modelo de voz para:*\n💬 「${inputText}」`;

  // Enviar menú con imagen y caption kawaii 🦈
  const sentMsg = await Matrix.sendMessage(
    m.from,
    {
      image: { url: "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png" },
      caption: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363399729727124@newsletter",
          newsletterName: "🌊💙 𝐆𝐀𝐖𝐑 𝐆𝐔𝐑𝐀 𝐌𝐃 💙🌊",
          serverMessageId: 151,
        },
      },
    },
    { quoted: m }
  );

  const messageID = sentMsg.key.id;
  let handlerActive = true;

  const handlerTimeout = setTimeout(() => {
    handlerActive = false;
    Matrix.ev.off("messages.upsert", messageHandler);
    Matrix.sendMessage(m.from, { text: "⌛ Tiempo agotado 🦈💤\nVuelve a intentarlo con el comando de nuevo 💙" }, { quoted: m });
  }, 120000);

  // 🎣 Captura de respuesta del usuario
  const messageHandler = async (msgData) => {
    if (!handlerActive) return;

    const receivedMsg = msgData.messages[0];
    if (!receivedMsg || !receivedMsg.message) return;

    const receivedText =
      receivedMsg.message.conversation ||
      receivedMsg.message.extendedTextMessage?.text ||
      receivedMsg.message.buttonsResponseMessage?.selectedButtonId;

    const senderID = receivedMsg.key.remoteJid;
    const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

    if (isReplyToBot && senderID === m.from) {
      clearTimeout(handlerTimeout);
      Matrix.ev.off("messages.upsert", messageHandler);
      handlerActive = false;

      // 🦈 Reacción para confirmar
      await Matrix.sendMessage(senderID, {
        react: { text: "⬇️", key: receivedMsg.key },
      });

      const selectedNumber = receivedText.trim();
      const selectedModel = voiceModels.find((model) => model.number === selectedNumber);

      if (!selectedModel) {
        return Matrix.sendMessage(senderID, { text: "❌ Opción inválida 💔\nResponde con un número del menú 🦈" });
      }

      try {
        await Matrix.sendMessage(
          m.from,
          { text: `🔊 Generando audio con la voz de ${selectedModel.name}... 🎶` },
          { quoted: receivedMsg }
        );

        const apiUrl = `https://api.agatz.xyz/api/voiceover?text=${encodeURIComponent(
          inputText
        )}&model=${selectedModel.model}`;

        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (data.status === 200 && data.data?.oss_url) {
          await Matrix.sendMessage(
            m.from,
            {
              audio: { url: data.data.oss_url },
              mimetype: "audio/mpeg",
            },
            { quoted: receivedMsg }
          );
          await Matrix.sendMessage(m.from, { text: "✅ ¡Audio generado con éxito! 🌊💙" });
        } else {
          await Matrix.sendMessage(m.from, { text: "❌ Error generando el audio 🦈\nInténtalo de nuevo 💙" });
        }
      } catch (error) {
        console.error("⚠️ Error API:", error);
        await Matrix.sendMessage(m.from, { text: "❌ Hubo un error procesando tu solicitud 🦈💔" });
      }
    }
  };

  Matrix.ev.on("messages.upsert", messageHandler);
};

export default aivoice;

// 🦈💙𓆝𓆟𓆞𓆝𓆟𓆞𓆝 Fin del código Gawr Gura Edition 💙🌊 //
