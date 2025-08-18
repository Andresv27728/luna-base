import config from '../config.cjs';

// 🌊 Reacciones random estilo Gura
const guraReacts = ["🦈", "🌊", "💙", "✨", "⚓", "🎶", "🐟", "⭐"];
function randomReact() {
  return guraReacts[Math.floor(Math.random() * guraReacts.length)];
}

// 🌊 Bordes decorativos
const borders = [
  "🌊〘════════════〙🌊",
  "🦈〘☆彡彡彡☆〙🦈",
  "💙〘──────────〙💙",
  "✨〘✧･ﾟ: *✧･ﾟ:*〙✨",
  "🔹〘❖═════════❖〙🔹",
];
function randomDecor() {
  return borders[Math.floor(Math.random() * borders.length)];
}

// 🦈 Stickers/emojis aleatorios
const guraStickers = ["🦈","🌊","💙","✨","🐟","⚓","🌐","⭐","😸","🎶"];
function randomStickers(max = 8) {
  let count = Math.floor(Math.random() * (max + 1));
  let shuffled = guraStickers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autotyping') {
    if (!isCreator) {
      return Matrix.sendMessage(
        m.from,
        { text: `${randomDecor()}\n📛 *Este comando es solo para el dueño del arrecife* 🦈🌊\n${randomDecor()}` },
        { quoted: m }
      );
    }

    let responseMessage;

    if (text === 'on') {
      config.AUTO_TYPING = "true";
      responseMessage = `${randomDecor()}\n✅ *Auto-Typing activado*~ 💙✨\nAhora el bot escribirá como si fuese Gura 🦈\n${randomStickers()}\n${randomDecor()}`;
    } else if (text === 'off') {
      config.AUTO_TYPING = "false";
      responseMessage = `${randomDecor()}\n❌ *Auto-Typing desactivado* 🌊\nEl arrecife está en silencio… 🦈💤\n${randomStickers()}\n${randomDecor()}`;
    } else {
      responseMessage = `${randomDecor()}\n📌 *Uso correcto del comando:*\n\n- \`.autotyping on\` ➝ Activa Auto-Typing ✨\n- \`.autotyping off\` ➝ Desactiva Auto-Typing 🌊\n${randomStickers()}\n${randomDecor()}`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
      await Matrix.sendMessage(m.key.remoteJid, { react: { text: randomReact(), key: m.key } });
    } catch (error) {
      console.error("Error en autotyping:", error);
      await Matrix.sendMessage(
        m.from,
        { text: `${randomDecor()}\n❌ Oopsie~ error en Auto-Typing: ${error.message} 🦈\n${randomDecor()}` },
        { quoted: m }
      );
    }
  }
};

export default autotypingCommand;
