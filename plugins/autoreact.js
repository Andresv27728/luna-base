import config from '../config.cjs';

// 🌊🦈 GAWR GURA - AUTO REACT COMMAND 🦈🌊
const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("📛 *Este es un comando solo para el Owner* 🦈");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_REACT = "true";  // <-- activar como string
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
✨ *AUTO_REACT ha sido activado* 🦈  
╚═══✦•🌊•✦═══╝`;
    } else if (text === 'off') {
      config.AUTO_REACT = "false"; // <-- desactivar como string
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
💤 *AUTO_REACT ha sido desactivado* 🦈  
╚═══✦•🌊•✦═══╝`;
    } else {
      responseMessage = 
`⚙️ *Uso correcto:*  
- \`${prefix}autoreact on\` → Activar auto-reacciones 🦈  
- \`${prefix}autoreact off\` → Desactivar auto-reacciones 🌊`;
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
