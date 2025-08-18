import config from '../config.cjs';

// 🌊🦈 GAWR GURA - AUTO RECORDING COMMAND 🦈🌊
const autorecordingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autorecording') {
    if (!isCreator) return m.reply("📛 *Este es un comando exclusivo del Owner* 🦈");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_RECORDING = "true";   // <-- mantener como string
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
🎙️ *Auto-Grabación activada* 🦈  
╚═══✦•🌊•✦═══╝`;
    } else if (text === 'off') {
      config.AUTO_RECORDING = "false";  
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
💤 *Auto-Grabación desactivada* 🌊  
╚═══✦•🌊•✦═══╝`;
    } else {
      responseMessage = 
`⚙️ *Uso correcto:*  
- \`${prefix}autorecording on\` → Activar auto-grabación 🎙️🦈  
- \`${prefix}autorecording off\` → Desactivar auto-grabación 🌊💤`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("❌ Error al procesar tu solicitud:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Ocurrió un error mientras se procesaba 🦈' }, { quoted: m });
    }
  }
};

export default autorecordingCommand;
