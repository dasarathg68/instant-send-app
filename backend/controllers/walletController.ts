import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addWallet = async (req: Request, res: Response) => {
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
};

export const deleteSolanaWallet = async (req: Request, res: Response) => {
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
};
export const deleteEthereumWallet = async (req: Request, res: Response) => {
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
};
