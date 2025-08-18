import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (err) {
    console.error("Reaction Error:", err);
  }
}

const createNewsletterContext = (sender) => ({
  mentionedJid: [sender],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363292876277898@newsletter",
    newsletterName: "🌊 GAWR GURA MD 🦈",
    serverMessageId: 143,
  },
});

// Image Generation Command (FluxAI)
const genCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["gen", "imagine", "flux", "draw"].includes(cmd)) return;

  await doReact("⏳", m, Matrix);

  let prompt = body.slice(prefix.length + cmd.length).trim();
  if (!prompt) prompt = "a beautiful abstract painting";

  const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(prompt)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    let imageBuffer;
    if (response.data && response.data.length > 0) {
      imageBuffer = Buffer.from(response.data);
    } else {
      // fallback si no devuelve imagen
      const fallbackUrl = "https://files.catbox.moe/cwc3s7.jpg";
      imageBuffer = await axios
        .get(fallbackUrl, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data));
    }

    await Matrix.sendMessage(
      m.key.remoteJid,
      {
        image: imageBuffer,
        caption: `🎨 *Imagen generada para:* _${prompt}_\n\n🌊 *GAWR GURA MD 🦈*`,
        contextInfo: createNewsletterContext(m.sender),
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (error) {
    console.error("Image Gen Error:", error);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.key.remoteJid,
      {
        text: "❌ No pude generar la imagen, intenta de nuevo más tarde.",
        contextInfo: createNewsletterContext(m.sender),
      },
      { quoted: m }
    );
  }
};

export default genCmd;
