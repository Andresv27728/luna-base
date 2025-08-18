(async () => {
let fs = require('fs');
const { exec } = require('child_process');
const { cmd } = require('../command');

// ⚠️ Inserta tu token aquí directamente
const GITHUB_TOKEN = "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"; 

// 🌊 Decoraciones Gura kawaii
const decorations = [
  { top: "︵‿︵‿୨♡୧‿︵‿︵", bottom: "︵‿︵‿୨♡୧‿︵‿︵" },
  { top: "🐚═───═🌊═───═🐚", bottom: "🐚═───═🌊═───═🐚" },
  { top: "✧˖°˖☆˖°˖✧", bottom: "✧˖°˖☆˖°˖✧" },
  { top: "🦈 ~~~~~ 🌊", bottom: "🌊 ~~~~~ 🦈" },
  { top: "💙⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆", bottom: "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆💙" },
];

cmd({
    pattern: "update",
    react: "💜",
    desc: "Actualizar el repositorio desde GitHub (con soporte privado) 🦈",
    category: "system",
    use: '.update',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let repoUrl = 'https://github.com/Andresv27728/luna-base.git'; 
        const targetFolder = 'plugins';

        // Si hay TOKEN, reescribimos URL para repos privados
        if (GITHUB_TOKEN) {
            const repoMatch = repoUrl.match(/github\.com\/(.+?)(?:\.git)?$/);
            if (repoMatch) {
                repoUrl = `https://${GITHUB_TOKEN}@github.com/${repoMatch[1]}.git`;
            }
        }

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder); 
        }

        const gitCommand = fs.existsSync(`${targetFolder}/.git`)
            ? `git -C ${targetFolder} pull`
            : `git clone ${repoUrl} ${targetFolder}`;

        // Ejecuta comando git
        await new Promise((resolve, reject) => {
            exec(gitCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(`Git command failed: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        });

        // 🌊 Selecciona decoración random
        const deco = decorations[Math.floor(Math.random() * decorations.length)];

        const successMsg = `
🦈💙 *ＡＣＴＵＡＬＩＺＡＣＩＯＮ ＧＡＷＲ ＧＵＲＡ* 💙🦈

${deco.top}
✨ Repositorio actualizado con éxito~  
🌊 ¡Todo está listo para surfear las olas del código!
${deco.bottom}

🐚 *Fuente:* ${repoUrl.replace(GITHUB_TOKEN, "****")}
💻 *Carpeta destino:* ${targetFolder}
🔑 *Privado:* ${GITHUB_TOKEN ? "Sí (usando token)" : "No"}
        `.trim();

        await conn.sendMessage(from, { text: successMsg }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`😵‍💫 *Oops Gura se tropezó con el update:* ${error.message} 🌊`);
    }
});
})();
