import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("Error al reaccionar:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363399729727124@newsletter",
    newsletterName: "GAWR GURA",
    serverMessageId: 143,
  },
};

// Comando Trivia Quiz
const quizCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "quiz") return;

  await doReact("❓", m, Matrix);

  try {
    const res = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = res.data.results[0];
    const question = data.question;
    const correct = data.correct_answer;
    const allAnswers = [...data.incorrect_answers, correct].sort(() => Math.random() - 0.5);
    const answerIndex = allAnswers.findIndex(ans => ans === correct) + 1;

    await Matrix.sendMessage(
      m.from,
      {
        text:
          `🧠 *¡Momento de Trivia!*\n\n` +
          `❓ ${question}\n\n` +
          allAnswers.map((a, i) => `*${i + 1}.* ${a}`).join("\n") +
          `\n\n_Responde con el número correcto (1-${allAnswers.length}) en *10 segundos*_`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );

    const filter = (msg) => !msg.key.fromMe && msg.message?.conversation;
    const collected = await Matrix.waitForMessage(m.key.remoteJid, filter, { timeout: 10000 });

    if (!collected) {
      return Matrix.sendMessage(
        m.from,
        { text: "⏱️ ¡Se acabó el tiempo! No respondiste a tiempo.", contextInfo: newsletterContext },
        { quoted: m }
      );
    }

    const userAnswer = parseInt(collected.message.conversation.trim());

    if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > allAnswers.length) {
      return Matrix.sendMessage(
        m.from,
        { text: "❌ Respuesta inválida. Por favor responde con el número de tu elección.", contextInfo: newsletterContext },
        { quoted: m }
      );
    }

    if (userAnswer === answerIndex) {
      return Matrix.sendMessage(
        m.from,
        { text: "✅ ¡Correcto! ¡Eres un maestro de la trivia! 🎉", contextInfo: newsletterContext },
        { quoted: m }
      );
    } else {
      return Matrix.sendMessage(
        m.from,
        { text: `❌ ¡Incorrecto! La respuesta correcta era: *${answerIndex}. ${correct}*`, contextInfo: newsletterContext },
        { quoted: m }
      );
    }
  } catch (err) {
    console.error("Error en trivia:", err);
    return Matrix.sendMessage(
      m.from,
      { text: "❌ No se pudo obtener la pregunta de trivia. Intenta más tarde.", contextInfo: newsletterContext },
      { quoted: m }
    );
  }
};

// Comando Adivinanza
const riddleCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "riddle") return;

  await doReact("🧠", m, Matrix);

  try {
    const { data } = await axios.get("https://riddles-api.vercel.app/random");
    await Matrix.sendMessage(
      m.from,
      {
        text: `*Adivinanza:* ${data.riddle}\n*Respuesta:* ||${data.answer}||`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error en adivinanza:", e);
    await Matrix.sendMessage(
      m.from,
      {
        text: "❌ No se pudo obtener una adivinanza. Intenta más tarde.",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

// Comando Love Check
const lovecheckCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "lovecheck") return;

  await doReact("❤️", m, Matrix);

  const mentionedUser = m.mentionedJid?.[0];

  if (!mentionedUser) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Por favor menciona a un usuario para comprobar compatibilidad.\nEjemplo: .lovecheck @usuario",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const love = Math.floor(Math.random() * 101);

  await Matrix.sendMessage(
    m.from,
    {
      text: `💕 Compatibilidad entre *${m.sender.split("@")[0]}* y *${mentionedUser.split("@")[0]}*: *${love}%*`,
      contextInfo: { ...newsletterContext, mentionedJid: [m.sender, mentionedUser] },
    },
    { quoted: m }
  );
};

// Comando Match Me
const matchmeCmd = async (m, Matrix, groupMetadata) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "matchme") return;

  await doReact("🤝", m, Matrix);

  if (!groupMetadata) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❌ Este comando solo funciona en grupos.",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const participants = groupMetadata.participants.map(p => p.id);
  if (participants.length < 2) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "No hay suficientes miembros en el grupo para hacer un match.",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const pick = () => participants.splice(Math.floor(Math.random() * participants.length), 1)[0];
  const a = pick();
  const b = pick();

  const aUser = a.split("@")[0];
  const bUser = b.split("@")[0];
  const zeroWidthSpace = "\u200b";

  const text = `Match: @${aUser}${zeroWidthSpace} ❤️ @${bUser}${zeroWidthSpace}`;

  await Matrix.sendMessage(
    m.from,
    {
      text,
      mentions: [{ id: a }, { id: b }],
      contextInfo: newsletterContext,
    },
    { quoted: m }
  );
};

// Comando Reverse
const reverseCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (cmd !== "reverse") return;

  await doReact("🔄", m, Matrix);

  const input = body.slice(prefix.length + cmd.length).trim();
  if (!input) {
    return Matrix.sendMessage(
      m.from,
      {
        text: "❗️ Por favor proporciona un texto para invertir. Ejemplo: .reverse hola",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  const reversed = input.split("").reverse().join("");

  await Matrix.sendMessage(
    m.from,
    {
      text: reversed,
      contextInfo: newsletterContext,
    },
    { quoted: m }
  );
};

export {
  quizCmd,
  riddleCmd,
  lovecheckCmd,
  matchmeCmd,
  reverseCmd,
};
