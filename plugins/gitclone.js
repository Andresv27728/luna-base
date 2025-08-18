import { exec } from "child_process";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (err) {
    console.error("💥 GURA no pudo reaccionar:", err);
  }
}

const gitclone = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "gitclone" && cmd !== "clone") return;
  await doReact("📂", m, Matrix);

  const q = m.body.trim().slice(prefix.length + cmd.length).trim();

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363399729727124@newsletter", // GAWR GURA
      newsletterName: "GAWR GURA",
      serverMessageId: 143,
    },
  };

  if (!q || !q.startsWith("https://github.com/")) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "📌 Por favor, proporciona un enlace válido de un repositorio de GitHub.\nEjemplo: `.gitclone https://github.com/user/repo.git`",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const repoName = q.split("/").pop().replace(".git", "");
  const reposDir = path.join("/tmp", "repos");
  const repoPath = path.join(reposDir, repoName);
  const zipPath = `${repoPath}.zip`;

  try {
    if (!fs.existsSync(reposDir)) fs.mkdirSync(reposDir, { recursive: true });
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });

    await Matrix.sendMessage(
      m.from,
      {
        text: `🔄 Clonando tu repositorio...\n\n🔗 URL: ${q}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );

    exec(`git clone ${q} ${repoPath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error("Error al clonar:", error);
        return Matrix.sendMessage(
          m.from,
          {
            text: `🚨 Ups! No se pudo clonar el repositorio.\n💬 ${error.message}`,
            contextInfo: newsletterContext,
          },
          { quoted: m }
        );
      }

      await Matrix.sendMessage(
        m.from,
        {
          text: `📦 Comprimiendo el repositorio en ZIP...`,
          contextInfo: newsletterContext,
        },
        { quoted: m }
      );

      try {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", async () => {
          await Matrix.sendMessage(
            m.from,
            {
              document: fs.readFileSync(zipPath),
              mimetype: "application/zip",
              fileName: `${repoName}.zip`,
              caption: `🗂️ ¡Aquí tienes tu repositorio clonado!\n\n🔗 Origen: ${q}\n\nCon ❤️ por *GAWR GURA*!`,
              contextInfo: newsletterContext,
            },
            { quoted: m }
          );

          try {
            fs.rmSync(repoPath, { recursive: true, force: true });
            fs.unlinkSync(zipPath);
            console.log("🧹 Limpieza realizada.");
          } catch (cleanupErr) {
            console.error("Error al limpiar:", cleanupErr);
          }
        });

        archive.on("error", (err) => {
          console.error("Error al crear ZIP:", err);
          return Matrix.sendMessage(
            m.from,
            {
              text: `😢 No se pudo crear el archivo ZIP.\n💬 ${err.message}`,
              contextInfo: newsletterContext,
            },
            { quoted: m }
          );
        });

        archive.pipe(output);
        archive.directory(repoPath, false);
        archive.finalize();
      } catch (zipErr) {
        console.error("Error en ZIP:", zipErr);
        await Matrix.sendMessage(
          m.from,
          {
            text: `😵 Algo salió mal al comprimir el repositorio.\n💬 ${zipErr.message}`,
            contextInfo: newsletterContext,
          },
          { quoted: m }
        );
      }
    });
  } catch (e) {
    console.error("Error inesperado:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: `💥 Ocurrió un error inesperado.\n💬 ${e.message}`,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }
};

export default gitclone;
