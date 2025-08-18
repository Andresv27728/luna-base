import config from '../config.cjs';

// 🌊 GAWR GURA AUTO ACTION HANDLER 🦈
async function handleCommand(m, gss) {
    try {
        if (!m || !m.key) return;

        const sender = m.sender || m.key.remoteJid; // 🦈 Asegura que siempre haya remitente

        // 📝 Auto-typing (escribiendo...)
        if (config.AUTO_TYPING === "true" && m.from) {
            gss.sendPresenceUpdate("composing", m.from);
        }

        // 🎙️ Auto-recording (grabando...)
        if (config.AUTO_RECORDING === "true" && m.from) {
            gss.sendPresenceUpdate("recording", m.from);
        }

        // 🌐 Always online toggle (Disponible o No disponible)
        if (m.from) {
            gss.sendPresenceUpdate(
                config.ALWAYS_ONLINE === "true" ? 'available' : 'unavailable',
                m.from
            );
        }

        // 👀 Auto-read (marca como leído)
        if (config.AUTO_READ === "true") {
            await gss.readMessages([m.key]);
        }

        // ⛔ Auto-block para prefijos sospechosos (ej: 212)
        if (config.AUTO_BLOCK === "true" && sender?.startsWith('212')) {
            await gss.updateBlockStatus(sender, 'block');
        }

    } catch (error) {
        console.error('❌ Error en GAWR GURA autoaction.js:', error);
    }
}

export default handleCommand;
