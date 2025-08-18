import config from '../config.cjs';

// 🌊🦈 GAWR GURA - AUTO READ COMMAND 🦈🌊
const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoread') {
    if (!isCreator) return m.reply("📛 *Este es un comando solo para el Owner* 🦈");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_READ = "true";  // <-- activar como string
      responseMessage =
`╔═══✦•🌊•✦═══╗  
👀 *AUTO_READ ha sido activado* 🦈  
Los mensajes se leerán automáticamente~  
╚═══✦•🌊•✦═══╝`;
    } else if (text === 'off') {
      config.AUTO_READ = "false"; // <-- desactivar como string
      responseMessage =
`╔═══✦•🌊•✦═══╗  
💤 *AUTO_READ ha sido desactivado* 🌊  
Los mensajes ya no se leerán automáticamente~  
╚═══✦•🌊•✦═══╝`;
    } else {
      responseMessage =
`⚙️ *Uso correcto:*  
- \`${prefix}autoread on\` → Activar lectura automática 👀  
- \`${prefix}autoread off\` → Desactivar lectura automática 😴`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("❌ Error al procesar el comando:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Ocurrió un error al procesar tu solicitud 🦈' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
