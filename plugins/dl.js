import axios from "axios";
import path from "path";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 Error en la reacción:", err);
  }
}

const dl = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  const aliases = ["dl", "download", "getfile", "fetchfile", "grabfile"];
  if (!aliases.includes(cmd)) return;

  await doReact("📤", m, Matrix);

  const link = m.body.trim().slice(prefix.length + cmd.length).trim();
  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "GAWR GURA",
      serverMessageId: 143,
    },
  };

  if (!link) {
    return Matrix.sendMessage(
      m.from,
      { text: "❌ Por favor envía un enlace válido para descargar.\nEjemplo: `.dl https://example.com/file.pdf`", contextInfo: newsletterContext },
      { quoted: m }
    );
  }

  try {
    const filename = path.basename(link);
    const extension = path.extname(filename).substring(1).toLowerCase();

    let mimeType = "application/octet-stream";
    const types = {
      mp4: "video/mp4",
      apk: "application/vnd.android.package-archive",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      pdf: "application/pdf",
      zip: "application/zip",
      txt: "text/plain",
      json: "application/json",
      webp: "image/webp",
    };
    if (types[extension]) mimeType = types[extension];

    // Validar enlace
    await axios.get(link, { responseType: "arraybuffer" });

    const captionMessage = `🐬╭━━━〔 *GAWR GURA DOWNLOAD* 〕━━━╮
┃📤 Archivo: ${filename}
┃📂 Tipo: ${extension.toUpperCase()}
╰━━━━━━━━━━━━━━━━╯
🌙 _Con cariño por Gawr Gura_
🔌 _Powered by GAWR GURA_`;

    await Matrix.sendMessage(
      m.from,
      {
        document: { url: link },
        mimetype: mimeType,
        fileName: filename,
        caption: captionMessage,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (e) {
    console.error("❌ Error al descargar archivo:", e.message);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      { text: `❌ No se pudo obtener el archivo.\nMotivo: ${e.message}`, contextInfo: newsletterContext },
      { quoted: m }
    );
  }
};

export default dl;
