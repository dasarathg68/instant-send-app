import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";
import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error(
    "Please provide a bot token in the environment variable BOT_TOKEN."
  );
}

const bot = new Bot(process.env.BOT_TOKEN); // <-- put your bot token between the ""

bot.command("start", async (ctx) => {
  if (process.env.WEBAPP_URL) {
    let keyboard = new InlineKeyboard().webApp(
      "Open Instant Send App",
      process.env.WEBAPP_URL
    );
    await ctx.reply("Press the button below to open the App:", {
      reply_markup: keyboard,
    });
  }
});
bot.on("message", (ctx) => {
  console.log(ctx.update.message.contact); // <-- log the contact object
  ctx.reply("Got another message!");
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      bot.start();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
