const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Bot Token from BotFather
const TOKEN = process.env.BOT_TOKEN;
// Your webhook URL (must be HTTPS)
const url = process.env.WEBHOOK_URL;
// Port number for the Express server
const port = process.env.PORT || 3000;
// Webhook route (can be any secret path)
const path = "/telegram-bot-webhook";

const bot = new TelegramBot(TOKEN);

// Setting up the webhook
bot.setWebHook(`${url}/bot${TOKEN}`);

// Creating an Express application
const app = express();

// Use body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Define command and message handlers
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Got a Message <==> ${msg.text}`);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! Up and running.");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});

// Graceful shutdown
process.once("SIGINT", () => {
  bot.closeWebHook();
  process.exit(0);
});

process.once("SIGTERM", () => {
  bot.closeWebHook();
  process.exit(0);
});
