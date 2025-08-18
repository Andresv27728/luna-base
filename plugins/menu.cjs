(async () => {
  const { cmd } = await import('../command.js');

  const config = require('../config.cjs');
  const os = require('os');
  const platform = os.platform(); // 'linux', 'win32', 'darwin', etc.
  
  // Función de runtime
  function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
  
    let uptime = "";
    if (d > 0) uptime += d + "d ";
    if (h > 0) uptime += h + "h ";
    if (m > 0) uptime += m + "m ";
    uptime += s + "s";
  
    return uptime.trim();
  }
  
  cmd(
    {
      pattern: "menu",
      alias: ["getmenu"],
      react: "🦈",
      desc: "Muestra el menú mágico de comandos",
      category: "main",
      filename: __filename,
    },
    async (robin, mek, m, context) => {
      try {
        const { sender, reply, from } = context;

        // 🎨 Menú con decoración temática Gura
        let madeMenu = `
╭─── 🌊 *ＧＡＷＲ ＧＵＲＡ ｍｅｎｕ* 🦈 ───╮
┃ 💙 ᴏᴡɴᴇʀ : *${config.OWNER_NAME}*  
┃ 🐚 ᴘʀᴇꜰɪᴊᴏ : *[${config.PREFIX}]*  
┃ 🐳 ɴᴜᴍᴇʀᴏ : *${config.OWNER_NUMBER}*  
┃ 🌊 ᴄʀᴇᴀᴅᴏʀ : *𝐇𝐀𝐍𝐒 𝗧𝗘𝗖𝗛*  
┃ 🐟 ꜰᴇᴄʜᴀ : *${new Date().toLocaleDateString()}*  
┃ ⏰ ʜᴏʀᴀ : *${new Date().toLocaleTimeString()}*  
┃ 🦀 ꜱɪꜱᴛᴇᴍᴀ : *${platform}*  
┃ 🦈 ᴠᴇʀꜱɪᴏ́ɴ : *${config.VERSION}*  
┃ ⏱️ ᴀᴄᴛɪᴠᴀ : *${runtime(process.uptime())}*  
╰─── ⋆｡ﾟ✶°｡ ⋆｡ﾟ✶°｡ ⋆ ───╯

︵‿︵‿୨♡୧‿︵‿︵
🐚 𝐆𝐔𝐑𝐀 𝐒𝐀𝐘𝐒: "¡Listo para bucear en los comandos, ahooo~!"
︵‿︵‿୨♡୧‿︵‿︵

╭─🤖 *ＡＩ ＆ Ｃｈａｔ* 💬
│ 🌟 aivoice
│ 🧠 claude
│ 🌌 gemini
│ 🤖 gpt
│ ✨ lunaai
│ 🔮 metaai
│ 🎨 imagine
│ 💡 chatgpt
╰─

╭─🎨 *Ｃｒｅａｃｉóｎ ＆ Ｍｅｄｉａ* 🎬
│ 🎥 capcut
│ 🖌️ creact
│ 🖼️ ephoto
│ 🤹 emojimix
│ 🎞️ tostick
│ 🔐 obfuscate
│ 🧴 remini
│ 🖍️ removebg
│ 🎵 ringtone
│ 💬 trt
╰─

╭─👥 *Ｓｏｃｉａｌ ＆ Ｇｒｕｐｏｓ* 🤝
│ 💑 couplepic
│ ❤️ lovecheck
│ 💞 pair
│ 📊 groupinfo
│ 📝 updategdesc
│ 🔤 updategname
│ 🔗 join
╰─

╭─🛠️ *Ｕｔｉｌｉｄａｄｅｓ Ｇｕｒａ* ⚙️
│ 📧 tempmail
│ 📬 checkmail
│ ➗ calculate
│ 📚 topdf
│ 📅 calendar
│ 🆚 version
│ 🌍 country
│ 📂 mediafire
│ 🐙 gitclone
│ ⏰ opentime
│ 🕒 closetime
│ 🔄 restart
│ ⏹️ shutdown
╰─

╭─🎮 *Ｊｕｅｇｏｓ ＆ Ｄｉｖｅｒｓｉóｎ* 🎲
│ ❓ quiz
│ 🧩 riddle
│ 💘 matchme
│ 😂 jokes
│ 💬 quote
│ 💡 advice
│ 🌙 goodnight
│ 🔥 motivation
│ 🪙 coinflip
│ 📖 pokedex
│ 💖 waifu
│ 🎭 truth / dare
╰─

╭─📥 *Ｄｅｓｃａｒｇａｓ* ⬇️
│ 📱 apk
│ 🎵 ytmp3
│ 🎶 song
│ 🎥 ytmp4
│ 📹 video
│ 🎧 spotify
│ 📱 tiktok
│ 🖼️ wallpaper
╰─

╭─📚 *Ｋｎｏｗｌｅｄｇｅ ＆ Ｒｅｌｉｇｉóｎ* 📖
│ 📰 bbcnews
│ 🧠 wiki 
│ 🔍 epsearch
│ 📚 book
│ ✝️ bible
│ ☪️ quran
╰─

🐳━━━━━━━━━━━━━━🐳
   *ＧＡＷＲ ＧＵＲＡ *  
🐚━━━━━━━━━━━━━━🐚
        `.trim();
  
        const newsletterContext = {
          mentionedJid: [context.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363399729727124@newsletter',
            newsletterName: "🌊🦈 𝐆𝐔𝐑𝐀 🦈🌊",
            serverMessageId: 143,
          },
        };
  
        await robin.sendMessage(
          context.from,
          {
            image: {
              url: "https://files.catbox.moe/qifsi4.jpg",
            },
            caption: madeMenu,
            contextInfo: newsletterContext,
          },
          { quoted: mek }
        );
      } catch (e) {
        console.log(e);
        await context.reply(`😵‍💫 Error de Gura: ${e.message || e} 🌊`);
      }
    }
  );
})();
