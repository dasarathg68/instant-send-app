import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createBot } from "./bot";

dotenv.config();

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

if (!process.env.BOT_TOKEN) {
  throw new Error(
    "Please provide a bot token in the environment variable BOT_TOKEN."
  );
}

const bot = createBot(process.env.BOT_TOKEN);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

bot.start();
startServer();
