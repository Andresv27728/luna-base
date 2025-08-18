import config from '../config.cjs';

// 🌊🦈 GAWR GURA - AUTO STATUS VIEW COMMAND 🦈🌊
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['autostatus', 'autosview', 'autostatusview'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("📛 *Este es un comando exclusivo del Owner* 🦈");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_STATUS_SEEN = "true";    // <-- mantener como string
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
👀 *Auto-Status activado* 🦈  
Ahora veré todos los estados automáticamente 🌊  
╚═══✦•🌊•✦═══╝`;
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = "false";   
      responseMessage = 
`╔═══✦•🌊•✦═══╗  
💤 *Auto-Status desactivado* 🌊  
Ya no miraré los estados automáticamente 🦈  
╚═══✦•🌊•✦═══╝`;
    } else {
      responseMessage = 
`⚙️ *Uso correcto:*  
- \`${prefix + cmd} on\` → Activar Auto-Status 👀🦈  
- \`${prefix + cmd} off\` → Desactivar Auto-Status 💤🌊`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("❌ Error al procesar tu solicitud:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Ocurrió un error mientras se procesaba 🦈' }, { quoted: m });
    }
  }
};

export default anticallCommand;
