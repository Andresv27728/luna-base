import config from "../config.cjs";
import axios from "axios";
import fs from "fs";
import path from "path";

// 🎀 Helper: contexto tipo newsletter
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

// 🌊 Handler principal: Obfuscate con estilo Gura
const obfuscate = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["obfuscate", "obfs", "obf"].includes(cmd)) return;

  const args = m.body.trim().slice(prefix.length + cmd.length).trim();
  const ctx = getNewsletterContext([m.sender]);

  try {
    // 🦈 Reacciona con candado kawaii
    await Matrix.sendMessage(m.from, {
      react: { text: "🔒", key: m.key },
    });

    let jsCode = "";
    
    if (m.quoted && m.quoted.text) {
      jsCode = m.quoted.text;
    } else if (args) {
      jsCode = args;
    } else {
      return Matrix.sendMessage(
        m.from,
        { 
          text: `
🌊💙︵‿︵‿୨♡୧‿︵‿︵💙🌊
A~! 🦈 Por favor envía código *JavaScript* para ofuscar~
✨ Puedes responder a un archivo o escribirlo directamente~
🐚═───═🌊═───═🐚
          `,
          contextInfo: ctx
        },
        { quoted: m }
      );
    }

    const apiUrl = `https://apis.davidcyriltech.my.id/obfuscate?code=${encodeURIComponent(jsCode)}&level=low`;
    
    const response = await axios.get(apiUrl);
    if (!response.data.success) {
      return Matrix.sendMessage(
        m.from,
        { 
          text: `
😢 Oops~! No pude ofuscar tu código...
🦈 Inténtalo de nuevo más tarde, bloop bloop~ 💦
          `,
          contextInfo: ctx
        },
        { quoted: m }
      );
    }

    const obfuscatedCode = response.data.result.obfuscated_code.code;
    const filePath = path.join(process.cwd(), 'media/obfuscated.js');
    fs.writeFileSync(filePath, obfuscatedCode, 'utf8');

    await Matrix.sendMessage(
      m.from,
      {
        document: fs.readFileSync(filePath),
        mimetype: 'text/javascript',
        fileName: 'GURA-Obfuscated.js',
        caption: `
🔒✨ *¡Código ofuscado con éxito!* ✨🔒
︵‿︵‿୨♡୧‿︵‿︵
🌊 Powered by Gawr Gura 🦈💙
        `,
        contextInfo: ctx,
      },
      { quoted: m }
    );

    // Limpiar archivo temporal
    fs.unlinkSync(filePath);

  } catch (e) {
    console.error("Gura obfuscate error:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `😵‍💫 A~ ocurrió un error: ${e.message}\nIntenta otra vez ho~ 🦈`,
        contextInfo: ctx,
      },
      { quoted: m }
    );
  }
};

export default obfuscate;
