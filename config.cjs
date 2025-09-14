const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "",//your session id here
  PREFIX: process.env.PREFIX || "!",

  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "false",
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "",
  VERSION: process.env.VERSION || "1.0.0",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "LUNA-MD",
  OMDB_API_KEY: process.env.OMDB_API_KEY || "5e339fb7",

  ANTI_DELETE: process.env.ANTI_DELETE || "true",
  ANTI_DELETE_PATH: process.env.ANTI_DELETE_PATH || "inbox",

  AUTO_DL: process.env.AUTO_DL || "false",
  AUTO_READ: process.env.AUTO_READ || "false",
  AUTO_TYPING: process.env.AUTO_TYPING || "false",
  AUTO_RECORDING: process.env.AUTO_RECORDING || "true",
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
  AUTO_REACT: process.env.AUTO_REACT || "false",

  AUTO_BLOCK: process.env.AUTO_BLOCK || "true", //+212 Auto block
  REJECT_CALL: process.env.REJECT_CALL || "false",
  NOT_ALLOW: process.env.NOT_ALLOW || "true",

  MODE: process.env.MODE || "public",
  BOT_NAME: process.env.BOT_NAME || "Bot (beta)",
  MENU_IMAGE: process.env.MENU_IMAGE || "https://files.catbox.moe/6ja6rx.png",
  DESCRIPTION: process.env.DESCRIPTION || "En Desarrollo",
  OWNER_NAME: process.env.OWNER_NAME || "Yo Soy Yo",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "573133374132",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  WELCOME: process.env.WELCOME || "true"
};

module.exports = config;
