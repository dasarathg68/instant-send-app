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
exports.deleteEthereumWallet = exports.deleteSolanaWallet = exports.addWallet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, solanaAddress, ethereumAddress } = req.body;
        const existingUser = yield prisma.user.findUnique({
            where: { id },
        });
        if (existingUser) {
            // Update the existing user with the wallet address based on which one is provided
            if (solanaAddress) {
                yield prisma.user.update({
                    where: { id },
                    data: { solanaAddress },
                });
                res.status(200).send("Solana wallet updated successfully.");
            }
            else if (ethereumAddress) {
                yield prisma.user.update({
                    where: { id },
                    data: { ethereumAddress },
                });
                res.status(200).send("Ethereum wallet updated successfully.");
            }
        }
        else {
            // Create a new user with either the Solana or Ethereum address
            yield prisma.user.create({
                data: {
                    id,
                    name,
                    solanaAddress: solanaAddress || null,
                    ethereumAddress: ethereumAddress || null,
                },
            });
            res.status(201).send("Wallet added successfully.");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error adding wallet.");
    }
});
exports.addWallet = addWallet;
const deleteSolanaWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield prisma.user.update({
            where: { id: parseInt(id) },
            data: { solanaAddress: null },
        });
        res.send("Solana wallet deleted successfully.");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error deleting Solana wallet.");
    }
});
exports.deleteSolanaWallet = deleteSolanaWallet;
const deleteEthereumWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield prisma.user.update({
            where: { id: parseInt(id) },
            data: { ethereumAddress: null },
        });
        res.send("Ethereum wallet deleted successfully.");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error deleting Ethereum wallet.");
    }
});
exports.deleteEthereumWallet = deleteEthereumWallet;
