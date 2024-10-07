import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error(
    "Please provide a bot token in the environment variable BOT_TOKEN."
  );
}

const bot = new Bot(process.env.BOT_TOKEN); // <-- put your bot token between the ""

bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard();
  if (process.env.WEBAPP_URL)
    keyboard.webApp("Open Instant Send App", process.env.WEBAPP_URL);

  await ctx.reply("Press button bellow to open the App", {
    reply_markup: keyboard,
  });
}); // Handle other messages.

bot.on("message", (ctx) => {
  console.log(ctx.update.message.contact); // <-- log the contact object
  ctx.reply("Got another message!");
});

bot.start();
