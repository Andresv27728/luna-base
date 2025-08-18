import fetch from "node-fetch";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("❌ reaction error:", error);
  }
}

const pair = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "pair" && cmd !== "getpair" && cmd !== "clonebot") return;

  // LUNA MD reacts with a cheerful checkmark ✅
  await doReact("✅", m, Matrix);

  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter",
      newsletterName: "Gawr Gura",
      serverMessageId: 143,
    },
  };

  try {
    if (!q) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "😊  here! Please provide a phone number, e.g.: `.pair +23769690xxxx`",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const res = await fetch(`https://hans-pair-site.onrender.com/code?number=${encodeURIComponent(q)}`);
    const pairData = await res.json();

    if (!pairData || !pairData.code) {
      return Matrix.sendMessage(
        m.from,
        {
          text: "😢 Oops! Couldn't get your pairing code. Double‑check the number and try again!",
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );
    }

    const pairingCode = pairData.code;
    const doneMessage = "🎉 *LUNA MD Pairing Completed!* 💖";

    // Send completion message with code
    await Matrix.sendMessage(
      m.from,
      {
        text: `${doneMessage}\n\n*Your pairing code is:* \`${pairingCode}\``,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    // Pause briefly, then resend just the code
    await new Promise((r) => setTimeout(r, 2000));
    await Matrix.sendMessage(
      m.from,
      {
        text: `🔐 Here it is again: \`${pairingCode}\``,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("❌ error:", err);
    await Matrix.sendMessage(
      m.from,
      {
        text: `😵‍💫 An error occurred: ${err.message}. Please try again later!`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default pair;
