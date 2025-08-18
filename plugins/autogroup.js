import cron from 'node-cron';
import moment from 'moment-timezone';
import config from '../config.cjs';

let scheduledTasks = {};

// 🌊🦈 GAWR GURA - CONFIGURACIÓN DE GRUPO 🦈🌊
const groupSetting = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['group'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("📛 *Este comando solo puede usarse en grupos* 🦈");
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("📛 *El bot debe ser administrador para usar este comando* 🌊");
    if (!senderAdmin) return m.reply("📛 *Debes ser administrador para usar este comando* 🦈");

    const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
    if (args.length < 1) {
      return m.reply(
`🌊 *Uso correcto:* 🦈  
Ejemplos:  
- *${prefix + cmd} open* → Abrir el grupo.  
- *${prefix + cmd} close* → Cerrar el grupo.  
- *${prefix + cmd} open 04:00 PM* → Abrir a una hora programada.`
      );
    }

    const groupSetting = args[0].toLowerCase();
    const time = args.slice(1).join(' ');

    // 🔹 Acción inmediata si no hay tiempo programado
    if (!time) {
      if (groupSetting === 'close') {
        await gss.groupSettingUpdate(m.from, 'announcement');
        return m.reply(
`╔═══✦•🌊•✦═══╗  
🔒 *Grupo cerrado exitosamente* 🦈  
╚═══✦•🌊•✦═══╝`);
      } else if (groupSetting === 'open') {
        await gss.groupSettingUpdate(m.from, 'not_announcement');
        return m.reply(
`╔═══✦•🌊•✦═══╗  
🔓 *Grupo abierto exitosamente* 🦈  
╚═══✦•🌊•✦═══╝`);
      } else {
        return m.reply("⚠️ Configuración inválida. Usa: *open* o *close* 🌊");
      }
    }

    // 🔹 Validar formato de hora
    if (!/^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(time)) {
      return m.reply(
`⚠️ *Formato de hora inválido* 🕒  
Usa el formato: HH:mm AM/PM  

Ejemplo:  
- *${prefix + cmd} open 04:00 PM*`);
    }

    // 🔹 Convertir hora a formato 24h
    const [hour, minute] = moment(time, ['h:mm A', 'hh:mm A']).format('HH:mm').split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`;

    console.log(`📌 Programado ${groupSetting} a las ${cronTime} IST`);

    // Detener tareas previas
    if (scheduledTasks[m.from]) {
      scheduledTasks[m.from].stop();
      delete scheduledTasks[m.from];
    }

    // Programar nueva tarea
    scheduledTasks[m.from] = cron.schedule(cronTime, async () => {
      try {
        console.log(`⏰ Ejecutando tarea: ${groupSetting} a las ${moment().format('HH:mm')} IST`);
        if (groupSetting === 'close') {
          await gss.groupSettingUpdate(m.from, 'announcement');
          await gss.sendMessage(m.from, { text: "🔒 *Grupo cerrado automáticamente* 🦈" });
        } else if (groupSetting === 'open') {
          await gss.groupSettingUpdate(m.from, 'not_announcement');
          await gss.sendMessage(m.from, { text: "🔓 *Grupo abierto automáticamente* 🌊" });
        }
      } catch (err) {
        console.error('❌ Error en tarea programada:', err);
        await gss.sendMessage(m.from, { text: "⚠️ Ocurrió un error al actualizar la configuración del grupo." });
      }
    }, {
      timezone: "Asia/Kolkata"
    });

    m.reply(
`⏳ *El grupo se configurará en modo* 「 ${groupSetting.toUpperCase()} 」  
🕒 a las *${time} IST* 🌊🦈`);
  } catch (error) {
    console.error('Error:', error);
    m.reply("⚠️ Ocurrió un error al procesar el comando 🦈");
  }
};

export default groupSetting;
