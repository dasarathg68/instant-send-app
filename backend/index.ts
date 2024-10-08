import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/getContacts/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const contacts = await prisma.contacts.findMany({});
    const contactsWithStringIds = contacts.map((contact) => ({
      ...contact,
      id: contact.id.toString(),
      userId: contact.userId.toString(),
    }));

    res.json(contactsWithStringIds);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving contacts.");
  }
});
app.delete("/deleteContact/:id", async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(contactId);
    await prisma.contacts.delete({
      where: { id: BigInt(contactId) },
    });

    res.send("Contact deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting contact.");
  }
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
bot.on("message", async (ctx) => {
  console.log(ctx.update.message.contact); // Log the contact object
  try {
    if (ctx.update.message.contact) {
      ctx.reply("Got a contact!");

      const contactUserId = ctx.update.message.contact.user_id;
      const contactFirstName = ctx.update.message.contact.first_name || "";
      const contactLastName = ctx.update.message.contact.last_name || "";
      const contactName = contactFirstName + " " + contactLastName;

      // Check if contact's user ID is available
      if (!contactUserId) {
        return ctx.reply("User ID is missing for the contact.");
      }

      // Information from the message sender
      const senderId = ctx.update.message.from.id;
      const senderFirstName = ctx.update.message.from.first_name || "";
      const senderLastName = ctx.update.message.from.last_name || "";
      const senderName = senderFirstName + " " + senderLastName;

      // First, ensure the user (message sender) exists or create if not
      await prisma.user.upsert({
        where: { id: senderId },
        update: {},
        create: {
          id: senderId,
          name: senderName,
        },
      });

      // Now check if the contact already exists for this user
      const existingContact = await prisma.contacts.findFirst({
        where: {
          id: contactUserId,
          userId: senderId,
        },
      });

      if (existingContact) {
        ctx.reply("This contact is already saved.");
      } else {
        // If contact doesn't exist, create it and link to the user
        await prisma.contacts.create({
          data: {
            id: contactUserId,
            name: contactName,
            user: {
              connect: { id: senderId }, // Link to the existing user
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
