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
app.post("/addwallet", async (req, res) => {
  try {
    const { id, name, solanaAddress, ethereumAddress } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (existingUser) {
      // Update the existing user with the wallet address based on which one is provided
      if (solanaAddress) {
        await prisma.user.update({
          where: { id },
          data: { solanaAddress },
        });
        res.status(200).send("Solana wallet updated successfully.");
      } else if (ethereumAddress) {
        await prisma.user.update({
          where: { id },
          data: { ethereumAddress },
        });
        res.status(200).send("Ethereum wallet updated successfully.");
      }
    } else {
      // Create a new user with either the Solana or Ethereum address
      await prisma.user.create({
        data: {
          id,
          name,
          solanaAddress: solanaAddress || null,
          ethereumAddress: ethereumAddress || null,
        },
      });

      res.status(201).send("Wallet added successfully.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding wallet.");
  }
});
app.delete("/deletesolanawallet/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { solanaAddress: null },
    });

    res.send("Solana wallet deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting Solana wallet.");
  }
});
app.delete("/deleteethereumwallet/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { ethereumAddress: null },
    });

    res.send("Ethereum wallet deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting Ethereum wallet.");
  }
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
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
    await bot.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
