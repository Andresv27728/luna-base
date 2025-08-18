// 🌊🦈 𓆩★𓆪 PINGILI con estilo GAWR GURA 𓆩★𓆪 🦈🌊
// ─────────────────────────────────────────────
// 💙 Simple test decorado con burbujas kawaii

(async () => {
  const { cmd } = await import('../command.js');

  cmd({
    pattern: "pingili",
    alias: ["pili"],
    desc: "🌊 Simple ping test con vibra de Gawr Gura 🦈",
    react: "💥",
    use: ".pingili",
    category: "utility",
    filename: __filename,
  }, async (conn, mek, m, { reply }) => {
    await reply(
      "╭━━━〔 💥 PONGILI 💥 〕━━━⊷\n" +
      "┃ 🦈 Pongili from *GAWR GURA MD* 💙\n" +
      "┃ 🌊 Velocidad de conexión tiburoncita\n" +
      "╰━━━━━━━━━━━━━━━━━━━━━⪼✨"
    );
  });
})();
