import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createBot } from "./bot";
import contactRoutes from "./routes/contactRoutes";
import walletRoutes from "./routes/walletRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use("/contacts", contactRoutes);
app.use(express.json());
app.use("/wallet", walletRoutes);
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
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
