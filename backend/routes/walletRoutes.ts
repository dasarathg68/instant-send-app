import express from "express";

import {
  addWallet,
  deleteSolanaWallet,
  deleteEthereumWallet,
} from "../controllers/walletController";

const walletRoutes = express.Router();

walletRoutes.post("/addWallet", addWallet);
walletRoutes.delete("/deleteSolanaWallet/:id", deleteSolanaWallet);
walletRoutes.delete("/deleteEthereumWallet/:id", deleteEthereumWallet);

export default walletRoutes;
