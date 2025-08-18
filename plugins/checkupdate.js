import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Función de runtime
function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key }
    });
  } catch (error) {
    console.error('Error enviando reacción:', error);
  }
}

const version = async (m, Matrix) => {
  const prefix = '/'; // ajusta si usas otro en config

  const cmd = m.body && m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (!['version', 'changelog', 'cupdate', 'checkupdate'].includes(cmd)) return;

  await doReact('🚀', m, Matrix);

  try {
    // Leer versión local
    const localVersionPath = path.join(process.cwd(), 'data/changelog.json');
    let localVersion = 'Desconocida';
    let changelog = 'No hay changelog disponible.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath, 'utf-8'));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // Obtener última versión desde GitHub
    const rawVersionUrl = 'https://raw.githubusercontent.com/Andresv27728/luna-base/main/data/changelog.json';
    let latestVersion = 'Desconocida';
    let latestChangelog = 'No hay changelog disponible.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (error) {
      console.error('No se pudo obtener la última versión:', error);
    }

    // Contar plugins
    const pluginPath = path.join(process.cwd(), 'plugins');
    const pluginCount = fs.existsSync(pluginPath)
      ? fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length
      : 0;

    // Total de comandos
    const commands = Array.isArray(global.commands) ? global.commands : [];
    const totalCommands = commands.length;

    // Info del sistema
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    let lastUpdate = 'Desconocido';
    if (fs.existsSync(localVersionPath)) {
      lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();
    }

    // Link del repo
    const githubRepo = 'https://github.com/Andresv27728/luna-base';

    // Estado de actualización
    let updateMessage = `✅ *GAWR GURA MD está actualizado!*`;
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 *Tu GAWR GURA MD está desactualizado!*\n` +
        `🔹 *Versión actual:* ${localVersion}\n` +
        `🔹 *Última versión:* ${latestVersion}\n\n` +
        `Usa *.update* para actualizar.`;
    }

    const pushname = m.pushName || 'Usuario';

    const statusMessage = `╭━━━〔 🌊 *GAWR GURA STATUS* 🦈 〕━━━┈⊷\n\n` +
      `👋 Hola *${pushname}*\n\n` +
      `📌 *Bot:* GAWR GURA MD\n🔖 *Versión local:* ${localVersion}\n📢 *Última versión:* ${latestVersion}\n📂 *Plugins:* ${pluginCount}\n🔢 *Comandos:* ${totalCommands}\n\n` +
      `💾 *Sistema:*\n⏳ *Uptime:* ${uptime}\n📟 *RAM:* ${ramUsage}MB / ${totalRam}MB\n⚙️ *Host:* ${hostName}\n📅 *Última actualización:* ${lastUpdate}\n\n` +
      `📝 *Changelog:*\n${latestChangelog}\n\n` +
      `⭐ *Repo:* ${githubRepo}\n👤 *Owner:* GAWR GURA\n\n${updateMessage}\n\n` +
      `🌊🦈 ¡No olvides dar ⭐ y fork al repo!`;

    const newsletterContext = {
      mentionedJid: [m.sender],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399729727124@newsletter',
        newsletterName: '🌊 GAWR GURA MD 🦈',
        serverMessageId: 143,
      },
    };

    // Enviar mensaje con TU imagen
    await Matrix.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/cwc3s7.jpg' },
      caption: statusMessage,
      contextInfo: newsletterContext
    }, { quoted: m });
  } catch (error) {
    console.error('Error obteniendo versión:', error);
    await Matrix.sendMessage(
      m.from,
      { text: '❌ Hubo un error al verificar la versión del bot.' },
      { quoted: m }
    );
  }
};

export default version;
