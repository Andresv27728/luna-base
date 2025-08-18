import fetch from "node-fetch";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("❌ error de reacción:", error);
  }
}

const pair = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "pair" && cmd !== "getpair" && cmd !== "clonebot") return;

  // 🦈 Gura reacciona feliz con un check kawaii~
  await doReact("✅", m, Matrix);

  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "Gawr Gura",
      serverMessageId: 143,
    },
  };

  try {
    if (!q) {
      return Matrix.sendMessage(
        m.from,
        {
          text: `
🌊💙︵‿︵‿୨♡୧‿︵‿︵💙🌊
A~! 🦈 Por favor escribe un número de teléfono
Ejemplo: \`.pair +57300123xxxx\`
🐚═───═🌊═───═🐚
          `,
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const res = await fetch(
      `https://hans-pair-site.onrender.com/code?number=${encodeURIComponent(q)}`
    );
    const pairData = await res.json();

    if (!pairData || !pairData.code) {
      return Matrix.sendMessage(
        m.from,
        {
          text: `
😢 Oops~! No pude conseguir tu código de emparejamiento.
🦈 Verifica el número y vuelve a intentarlo~
✧˖°˖☆˖°˖✧
          `,
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const pairingCode = pairData.code;
    const doneMessage = `
🎉🦈 *Emparejamiento Gura Completado!* 🌊✨
︵‿︵‿୨♡୧‿︵‿︵
    `;

    // Enviar mensaje de éxito con el código
    await Matrix.sendMessage(
      m.from,
      {
        text: `${doneMessage}\n\n*Tu código mágico es:* \`${pairingCode}\` 💙`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    // Espera un momento y vuelve a mandar el código
    await new Promise((r) => setTimeout(r, 2000));
    await Matrix.sendMessage(
      m.from,
      {
        text: `🔐 Bloop bloop~ aquí está otra vez: \`${pairingCode}\` 🦈💦`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("❌ error:", err);
    await Matrix.sendMessage(
      m.from,
      {
        text: `😵‍💫 A~ ocurrió un errorcito: ${err.message}\nInténtalo más tarde, ho~ 🦈`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default pair;
