import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("Error al enviar reacción:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter", // actualizado
    newsletterName: "🌊 GAWR GURA MD 🦈",
    serverMessageId: 143,
  },
};

const countryinfoCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["countryinfo", "cinfo", "country", "cinfo2"].includes(cmd)) return;

  await doReact("🌍", m, Matrix);

  const query = body.slice(prefix.length + cmd.length).trim();

  if (!query) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Por favor, escribe el nombre de un país.\nEjemplo: `.countryinfo México`",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }

  try {
    const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(query)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      await doReact("❌", m, Matrix);
      return Matrix.sendMessage(
        m.from,
        {
          text: `❌ No encontré información para *${query}*. Verifica el nombre del país.`,
          contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
        },
        { quoted: m }
      );
    }

    const info = data.data;
    const neighborsText = info.neighbors.length > 0
      ? info.neighbors.map(n => `🌍 *${n.name}*`).join(", ")
      : "No se encontraron países vecinos.";

    const text =
      `🌍 *Información del país: ${info.name}* 🌍\n\n` +
      `🏛 *Capital:* ${info.capital}\n` +
      `📍 *Continente:* ${info.continent.name} ${info.continent.emoji}\n` +
      `📞 *Código telefónico:* ${info.phoneCode}\n` +
      `📏 *Área:* ${info.area.squareKilometers} km² (${info.area.squareMiles} mi²)\n` +
      `🚗 *Conduce por el lado:* ${info.drivingSide}\n` +
      `💱 *Moneda:* ${info.currency}\n` +
      `🔤 *Idiomas:* ${info.languages.native.join(", ")}\n` +
      `🌟 *Famoso por:* ${info.famousFor}\n` +
      `🌍 *Códigos ISO:* ${info.isoCode.alpha2.toUpperCase()}, ${info.isoCode.alpha3.toUpperCase()}\n` +
      `🌎 *Dominio TLD:* ${info.internetTLD}\n\n` +
      `🔗 *Países vecinos:* ${neighborsText}`;

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: info.flag || "https://files.catbox.moe/cwc3s7.jpg" }, // usa tu imagen si no hay bandera
        caption: text,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (e) {
    console.error("Error en comando countryinfo:", e);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ Hubo un error al obtener la información del país. Inténtalo más tarde.",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default countryinfoCmd;
