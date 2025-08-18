import fetch from "node-fetch";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("Error sending reaction:", error);
  }
}

const apk = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "apk" && cmd !== "app") return;

  // 🌊 Reacción tiburoncita
  await doReact("📲", m, Matrix);

  // Nombre de la app buscada
  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // 🦈 cambiado fijo
      newsletterName: "💙 GAWR GURA MD 🦈",
      serverMessageId: 143,
    },
  };

  try {
    if (!q) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "❌ *Por favor escribe el nombre de la app, desu~ 🦈* ❌",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const res = await fetch(
      `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`
    );
    const data = await res.json();

    if (!data.success) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "❌ *No pude encontrar esa app, buceemos de nuevo... 🌊* ❌",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    // 🌊 Decoración con bordes y temática Gura
    const randomBorders = [
      "╭━━━━〔 🦈 APP GAWR GURA 〕━━━━╮",
      "🌊━━━━━━━━━━━━━━━━━━━━━🌊",
      "💙═════════════════════💙",
      "✦━━⊶⦁⦁⦁⊷━━✦"
    ];
    const border = randomBorders[Math.floor(Math.random() * randomBorders.length)];

    const desc = `
${border}
📂 *Nombre:*  ${data.apk_name} 
📥 *Descarga iniciada...* 🚀
━━━━━━━━━━━━━━━━━━━━━
*POWERED BY GAWR GURA MD* 🦈💙`;

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: data.thumbnail },
        caption: desc,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    // 📲 Envío del archivo APK
    await Matrix.sendMessage(
      m.from,
      {
        document: { url: data.download_link },
        mimetype: "application/vnd.android.package-archive",
        fileName: `『 ${data.apk_name} 』.apk`,
        caption:
          "✅ *APK enviado con éxito, desu~* 🦈💙\n🔰 *Powered by GAWR GURA MD* 🌊",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ *Ocurrió un error mientras buscaba la app, tiburoncito...* ❌",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default apk;
