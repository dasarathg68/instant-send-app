import { Bot, InlineKeyboard } from "grammy";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createBot(token: string) {
  const bot = new Bot(token);

  bot.api
    .getMe()
    .then((me) => {
      console.log(`Bot started as ${me.username}`);
    })
    .catch((err) => {
      console.log(err);
    });

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

  bot.on("message", async (ctx) => {
    console.log(ctx.update.message.contact); // Log the contact object
    try {
      if (ctx.update.message.contact) {
        ctx.reply("Got a contact!");

        const contactUserId = ctx.update.message.contact.user_id;
        const contactFirstName = ctx.update.message.contact.first_name || "";
        const contactLastName = ctx.update.message.contact.last_name || "";
        const contactName = contactFirstName + " " + contactLastName;

        if (!contactUserId) {
          return ctx.reply("User ID is missing for the contact.");
        }

        const senderId = ctx.update.message.from.id;
        const senderFirstName = ctx.update.message.from.first_name || "";
        const senderLastName = ctx.update.message.from.last_name || "";
        const senderName = senderFirstName + " " + senderLastName;

        await prisma.user.upsert({
          where: { id: senderId },
          update: {},
          create: {
            id: senderId,
            name: senderName,
          },
        });

        const existingContact = await prisma.contacts.findFirst({
          where: {
            id: contactUserId,
            userId: senderId,
          },
        });

        if (existingContact) {
          ctx.reply("This contact is already saved.");
        } else {
          await prisma.contacts.create({
            data: {
              id: contactUserId,
              name: contactName,
              user: {
                connect: { id: senderId },
              },
            },
          });

          ctx.reply("Contact saved successfully.");
        }
      }
    } catch (err) {
      console.error(err);
      ctx.reply("An error occurred while processing the message.");
    }
  });

  return bot;
}
