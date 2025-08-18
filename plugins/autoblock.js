import config from '../config.cjs';

// 🌊🦈 GAWR GURA - AUTOBLOCK COMMAND HANDLER 🦈🌊
const autoblockCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoblock') {
    if (!isCreator) return m.reply("📛 *¡Este es un comando solo para el Creador!* 🦈");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_BLOCK = true;
      responseMessage = `
╔═══✦•🌊•✦═══╗
   🦈 *Auto-Block ACTIVADO* 🦈
╚═══✦•🌊•✦═══╝
> Ahora Gawr Gura bloqueará usuarios sospechosos automáticamente.`;
    } else if (text === 'off') {
      config.AUTO_BLOCK = false;
      responseMessage = `
╔═══✦•🌊•✦═══╗
   💤 *Auto-Block DESACTIVADO* 💤
╚═══✦•🌊•✦═══╝
> Gawr Gura ya no bloqueará automáticamente.`;
    } else {
      responseMessage = `
🌊 *Uso correcto del comando:* 🦈
> \`autoblock on\` → Activar el bloqueo automático.  
> \`autoblock off\` → Desactivar el bloqueo automático.`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("❌ Error procesando tu solicitud Gura~:", error);
      await Matrix.sendMessage(
        m.from,
        { text: "⚠️ Hubo un error al ejecutar el comando de Auto-Block 🌊" },
        { quoted: m }
      );
    }
  }
};

export default autoblockCommand;
