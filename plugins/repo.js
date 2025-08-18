import fetch from 'node-fetch';
import config from '../config.cjs';

// Reaction helper
async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("Reaction error:", e);
  }
}

// 🔒 Newsletter fijo
const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter", // 👈 siempre este
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

// 🎨 Bordes decorativos Gawr Gura style
const borders = [
  "🌊〘════════════〙🌊",
  "🦈〘☆彡彡彡☆〙🦈",
  "💙〘──────────〙💙",
  "✨〘✧･ﾟ: *✧･ﾟ:*〙✨",
  "🔹〘❖═════════❖〙🔹"
];

// 🦈 Stickers/Emojis Gawr Gura (random, máx 10)
const guraStickers = ["🦈","🌊","💙","✨","🐟","⚓","🌐","⭐","😸","🎶"];

// Helper para randomizar decoraciones
function randomDecor(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomStickers(max = 10) {
  let count = Math.floor(Math.random() * (max + 1));
  let shuffled = guraStickers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

// 📂 Comando Repo
const repoCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (["repo", "sc", "script", "info", "source"].includes(cmd)) {
    await doReact("📂", m, Matrix);
    try {
      // Info del repo
      const repoData = {
        name: "GAWR GURA",
        owner: "YO SOY YO",
        repo: "GAWRGURA",
        url: "https://github.com/Andresv27728/GawrGura.git",
        description: "Tu waifu tiburoncita con superpoderes digitales! 🦈💙",
        image: "https://files.catbox.moe/cwc3s7.jpg"
      };

      // GitHub API
      const apiUrl = `https://api.github.com/repos/${repoData.owner}/${repoData.repo}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      const githubData = await response.json();

      // Random decoraciones
      const topBorder = randomDecor(borders);
      const bottomBorder = randomDecor(borders);
      const stickerLine = randomStickers(10);

      // Formato decorado
      const repoInfo = `
${topBorder}

🦈 *Repositorio de Gawr Gura)* 🌊💙

🤖 *Bot:* ${repoData.name}
👩‍💻 *Creador:* ${githubData.owner?.login || repoData.owner}
⭐ *Estrellas:* ${githubData.stargazers_count || 0}
🌿 *Forks:* ${githubData.forks_count || 0}
📅 *Última actualización:* ${new Date(githubData.updated_at).toLocaleDateString()}

📝 *Descripción:*
${githubData.description || repoData.description}

🔗 *GitHub:*
${repoData.url}

${stickerLine ? "💙 "+stickerLine+" 💙" : ""}

${bottomBorder}

✨ Powered by Gawr Gura 🦈💙
`.trim();

      // Enviar con imagen + decoraciones
      await Matrix.sendMessage(
        m.from,
        {
          image: { url: repoData.image },
          caption: repoInfo,
          contextInfo: newsletterContext
        },
        { quoted: m }
      );

    } catch (e) {
      console.error("Repo command error:", e);

      // Fallback sin API, pero con decoraciones
      const topBorder = randomDecor(borders);
      const bottomBorder = randomDecor(borders);
      const stickerLine = randomStickers(8);

      const fallbackInfo = `
${topBorder}

🦈 *Repositorio de GURA* 🌊💙

🤖 *Bot:* GAWR GURA
👩‍💻 *Creador:* Yo SOY YO
🔗 *GitHub:* https://github.com/Andresv27728/GawrGura.git

📝 *Descripción:*
Tu waifu tiburoncita con superpoderes digitales! 🦈💙

${stickerLine ? "✨ "+stickerLine+" ✨" : ""}

${bottomBorder}

💙 Hecho con amor por Yo Soy Yo 💙
`.trim();

      await Matrix.sendMessage(
        m.from,
        {
          text: fallbackInfo,
          contextInfo: newsletterContext
        },
        { quoted: m }
      );
    }
  }
};

export default repoCmd;
