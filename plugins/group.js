import fs from "fs";
import path from "path";
import config from "../config.cjs";

// 🌊 Reacciones random estilo Gura
const guraReacts = ["🦈", "🌊", "💙", "✨", "🎶", "⚓", "✅", "❌"];
function randomReact() {
  return guraReacts[Math.floor(Math.random() * guraReacts.length)];
}

async function doReact(m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: randomReact(), key: m.key },
    });
  } catch (e) {
    console.error("❌ Reaction error:", e);
  }
}

// 📢 Newsletter fijo
const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

// 🌊 Bordes decorativos Gura
const borders = [
  "🌊〘════════════〙🌊",
  "🦈〘☆彡彡彡☆〙🦈",
  "💙〘──────────〙💙",
  "✨〘✧･ﾟ: *✧･ﾟ:*〙✨",
  "🔹〘❖═════════❖〙🔹",
];

// 🦈 Stickers/Emojis random
const guraStickers = ["🦈","🌊","💙","✨","🐟","⚓","🌐","⭐","😸","🎶"];
function randomStickers(max = 10) {
  let count = Math.floor(Math.random() * (max + 1));
  let shuffled = guraStickers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

function randomDecor(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 📝 Comando para actualizar descripción
const updateDescCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  if (!body.startsWith(prefix)) return;

  const parts = body.slice(prefix.length).trim().split(/ +/);
  const cmd = parts.shift().toLowerCase();
  const newDesc = parts.join(" ").trim();

  if (!["setdesc", "updesc", "groupdesc", "gd", "desc"].includes(cmd)) return;

  const jid = m.key.remoteJid;

  // 🚫 Verificar si es un grupo
  if (!jid.endsWith("@g.us")) {
    await Matrix.sendMessage(
      jid,
      {
        text: `${randomDecor(borders)}\n❌ *Este comando solo funciona en grupos* 🦈💙\n${randomDecor(borders)}`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
    return;
  }

  // 👑 Verificar admin
  const metadata = await Matrix.groupMetadata(jid);
  const admins = metadata.participants
    .filter((p) => p.admin !== null)
    .map((p) => p.id);

  const isSenderAdmin = admins.includes(m.sender);

  if (!isSenderAdmin) {
    await Matrix.sendMessage(
      jid,
      {
        text: `${randomDecor(borders)}\n❌ Solo los *admins del grupo* pueden cambiar la descripción 🌊🦈\n${randomDecor(borders)}`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
    return;
  }

  // 🎨 Reacción
  await doReact(m, Matrix);

  // 📌 Si no dio descripción
  if (!newDesc) {
    return Matrix.sendMessage(
      jid,
      {
        text: `${randomDecor(borders)}\n✏️ Por favor escribe la nueva *descripción del grupo* 💙\n\n📌 *Ejemplo:* \`.setdesc Bienvenidos al arrecife de Gura~ 🦈🌊\`\n${randomDecor(borders)}`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  try {
    await Matrix.groupUpdateDescription(jid, newDesc);

    const stickerLine = randomStickers(8);
    await Matrix.sendMessage(
      jid,
      {
        text: `${randomDecor(borders)}\n✅ *Descripción del grupo actualizada con éxito* 🦈🌊\n\n${stickerLine}\n${randomDecor(borders)}`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
    await doReact(m, Matrix);
  } catch (error) {
    console.error("UpdateDesc Error:", error);
    await doReact(m, Matrix);
    await Matrix.sendMessage(
      jid,
      {
        text: `${randomDecor(borders)}\n❌ Falló al actualizar la descripción...\nVerifica que yo también tenga *permisos de admin* 🦈💙\n${randomDecor(borders)}`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default updateDescCmd;
