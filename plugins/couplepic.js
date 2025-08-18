import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("Reaction error:", err);
  }
}

const couplepp = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["couplepp", "couple-pic", "couplepic", "coupleppic", "cpp"].includes(cmd)) return;

  await doReact("💑", m, Matrix);

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // actualizado
      newsletterName: "🌊 GAWR GURA MD 🦈",
      serverMessageId: 143,
    },
  };

  try {
    const { data } = await axios.get("https://apis.davidcyriltech.my.id/couplepp");

    // fallback si no devuelve links válidos
    const malePic = data?.male || "https://files.catbox.moe/cwc3s7.jpg";
    const femalePic = data?.female || "https://files.catbox.moe/cwc3s7.jpg";

    const caption = "🌊 GAWR GURA MD 🦈\nParejita de perfil 💕";

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: malePic },
        caption: `👦 *Foto de perfil para él*\n\n${caption}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: femalePic },
        caption: `👧 *Foto de perfil para ella*\n\n${caption}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (e) {
    console.error("Error en couplepp:", e.message);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      {
        text: `❌ Ocurrió un error al obtener las fotos de pareja.\n*Detalles:* ${e.message}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default couplepp;
