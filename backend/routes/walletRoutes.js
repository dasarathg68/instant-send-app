"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const walletRoutes = express_1.default.Router();
walletRoutes.post("/addWallet", walletController_1.addWallet);
walletRoutes.delete("/deleteSolanaWallet/:id", walletController_1.deleteSolanaWallet);
walletRoutes.delete("/deleteEthereumWallet/:id", walletController_1.deleteEthereumWallet);
exports.default = walletRoutes;
