import config from "../config.cjs";

// 🌊 Formateador de tiempo
function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// 🦈 Contexto tipo newsletter
function getNewsletterContext(mentioned = []) {
  return {
    mentionedJid: mentioned,
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "Gawr Gura 🦈💙",
      serverMessageId: 175,
    },
  };
}

// 🌊 Variaciones de decoraciones random
const decorations = [
  { top: "︵‿︵‿୨♡୧‿︵‿︵", bottom: "︵‿︵‿୨♡୧‿︵‿︵" },
  { top: "🐚═───═🌊═───═🐚", bottom: "🐚═───═🌊═───═🐚" },
  { top: "✧˖°˖☆˖°˖✧", bottom: "✧˖°˖☆˖°˖✧" },
  { top: "🦈 ~~~~~ 🌊", bottom: "🌊 ~~~~~ 🦈" },
  { top: "○●○●○●○●○", bottom: "○●○●○●○●○" },
  { top: "💙⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆", bottom: "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆💙" },
];

// 🌊 Handler de Ping
const pingTest = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["ping", "pong", "🚀"].includes(cmd)) return;

  const ctx = getNewsletterContext([m.sender]);
  const start = Date.now();

  try {
    const speedEmojis = ["⚡", "🚀", "💨", "✨", "🌟", "🔰", "🦈", "🌊"];
    const reactEmoji = speedEmojis[Math.floor(Math.random() * speedEmojis.length)];
    await Matrix.sendMessage(m.from, {
      react: { text: reactEmoji, key: m.key },
    });

    const end = Date.now();
    const responseTime = end - start;
    const uptimeFormatted = runtime(process.uptime());

    let rating;
    if (responseTime < 200) rating = "⚡🐬 SUPER VELOZ COMO GURA ⚡";
    else if (responseTime < 500) rating = "🚀🌊 VELOCIDAD DE OLAS 🚀";
    else if (responseTime < 1000) rating = "🏎️💙 RÁPIDO COMO UN TIBURÓN";
    else rating = "🐢... Lento como una tortuguita en el mar~";

    // Selección random de decoración
    const deco = decorations[Math.floor(Math.random() * decorations.length)];

    const pingMsg = `
🦈💙 *ＰＩＮＧ - ＧＡＷＲ ＧＵＲＡ* 💙🦈

${deco.top}
🌊 *Tiempo de Respuesta:* ${responseTime}ms
✨ *Rendimiento:* ${rating}
⏱️ *Tiempo Activo:* ${uptimeFormatted}
${deco.bottom}

💻 *Servidor:* ${config.HEROKU_APP_NAME || "Local"}
🌐 *Versión:* ${config.VERSION || "1.0.0"}

Powered by *Gura Gura Style* 🦈💙
    `.trim();

    await Matrix.sendMessage(
      m.from,
      {
        text: pingMsg,
        contextInfo: ctx,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Gura ping error:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `😵‍💫 A~ ocurrió un error en el ping: ${e.message} 🦈`,
        contextInfo: ctx,
      },
      { quoted: m }
    );
  }
};

export default pingTest;
