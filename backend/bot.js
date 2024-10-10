"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = createBot;
const grammy_1 = require("grammy");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createBot(token) {
    const bot = new grammy_1.Bot(token);
    bot.api
        .getMe()
        .then((me) => {
        console.log(`Bot started as ${me.username}`);
    })
        .catch((err) => {
        console.log(err);
    });
    bot.command("start", (ctx) => __awaiter(this, void 0, void 0, function* () {
        if (process.env.WEBAPP_URL) {
            let keyboard = new grammy_1.InlineKeyboard().webApp("Open Instant Send App", process.env.WEBAPP_URL);
            yield ctx.reply("Press the button below to open the App:", {
                reply_markup: keyboard,
            });
        }
    }));
    bot.on("message", (ctx) => __awaiter(this, void 0, void 0, function* () {
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
                yield prisma.user.upsert({
                    where: { id: senderId },
                    update: {},
                    create: {
                        id: senderId,
                        name: senderName,
                    },
                });
                const existingContact = yield prisma.contacts.findFirst({
                    where: {
                        id: contactUserId,
                        userId: senderId,
                    },
                });
                if (existingContact) {
                    ctx.reply("This contact is already saved.");
                }
                else {
                    yield prisma.contacts.create({
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
        }
        catch (err) {
            console.error(err);
            ctx.reply("An error occurred while processing the message.");
        }
    }));
    return bot;
}
if (!process.env.BOT_TOKEN) {
    throw new Error("Please provide a bot token in the environment variable BOT_TOKEN.");
}
const bot = createBot(process.env.BOT_TOKEN);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield bot.start();
        console.log("Bot started successfully");
    }
    catch (error) {
        console.error("Failed to start the bot:", error);
    }
}))();
