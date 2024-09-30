// src/components/WalletGenerator.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  generateWalletFromMnemonic,
  Wallet,
  createMnemonic,
  validateWalletMnemonic,
} from "../utils/wallet";

// Add a new prop for network
interface WalletGeneratorProps {
  network: "ethereum" | "solana";
}

const WalletGenerator: React.FC<WalletGeneratorProps> = ({ network }) => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill(" ")
  );
  const [pathType, setPathType] = useState<string>("501"); // Default to Solana path
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKey, setVisiblePrivateKey] = useState<boolean>(false);

  // Define network-specific path types and names
  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };

  // Set default path based on the network prop
  useEffect(() => {
    setPathType(network === "ethereum" ? "60" : "501");
  }, [network]);

  const pathTypeName = pathTypeNames[pathType] || "";

  useEffect(() => {
    const storedWallet = localStorage.getItem(`${network}_wallet`);
    const storedMnemonic = localStorage.getItem(`${network}_mnemonics`);

    if (storedWallet && storedMnemonic) {
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallet(JSON.parse(storedWallet));
      setVisiblePrivateKey(false);
    }
  }, [network]);

  const handleDeleteWallet = () => {
    localStorage.removeItem(`${network}_wallet`);
    localStorage.removeItem(`${network}_mnemonics`);
    setWallet(null);
    setMnemonicWords(Array(12).fill(" "));
    toast.success("Wallet deleted successfully!");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleGenerateWallet = () => {
    if (wallet) {
      toast.error("A wallet already exists for this network.");
      return;
    }

    let mnemonic = mnemonicInput.trim();

    if (mnemonic) {
      if (!validateWalletMnemonic(mnemonic)) {
        toast.error("Invalid recovery phrase. Please try again.");
        return;
      }
    } else {
      mnemonic = createMnemonic();
    }

    const words = mnemonic.split(" ");
    setMnemonicWords(words);

    const newWallet = generateWalletFromMnemonic(pathType, mnemonic, 0); // Only 1 account (index 0)
    if (newWallet) {
      setWallet(newWallet);
      localStorage.setItem(`${network}_wallet`, JSON.stringify(newWallet));
      localStorage.setItem(`${network}_mnemonics`, JSON.stringify(words));
      toast.success("Wallet generated successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!wallet && (
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="flex flex-col gap-4">
            {pathType && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex flex-col gap-4 my-12"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="tracking-tighter text-4xl md:text-5xl font-black">
                    Secret Recovery Phrase for {pathTypeName}
                  </h1>
                  <p className="text-primary/80 font-semibold text-lg md:text-xl">
                    Save these words in a safe place.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="password"
                    placeholder="Enter your secret phrase (or leave blank to generate)"
                    onChange={(e) => setMnemonicInput(e.target.value)}
                    value={mnemonicInput}
                  />
                  <Button size={"lg"} onClick={handleGenerateWallet}>
                    {mnemonicInput ? "Add Wallet" : "Generate Wallet"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Display Secret Phrase */}
      {mnemonicWords && wallet && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="group flex flex-col items-center gap-4 cursor-pointer rounded-lg border border-primary/10 p-8"
        >
          <div
            className="flex w-full justify-between items-center"
            onClick={() => setShowMnemonic(!showMnemonic)}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Your Secret Phrase for {pathTypeName}
            </h2>
            <Button
              onClick={() => setShowMnemonic(!showMnemonic)}
              variant="ghost"
            >
              {showMnemonic ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>

          {showMnemonic && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col w-full items-center justify-center"
              onClick={() => copyToClipboard(mnemonicWords.join(" "))}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-2 gap-2 justify-center w-full items-center mx-auto my-8"
              >
                {mnemonicWords.map((word, index) => (
                  <p
                    key={index}
                    className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4"
                  >
                    {word}
                  </p>
                ))}
              </motion.div>
              <div className="text-sm md:text-base text-primary/50 flex w-full gap-2 items-center group-hover:text-primary/80 transition-all duration-300">
                <Copy className="size-4" /> Click Anywhere To Copy
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Display wallet details */}
      {wallet && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-8 mt-6"
        >
          <div className="flex justify-between w-full gap-4 items-center">
            <h2 className="tracking-tighter text-3xl md:text-4xl font-extrabold">
              {pathTypeName} Wallet
            </h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="self-end">
                  Delete Wallet
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this wallet?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your wallet and keys from local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWallet}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-col gap-8 px-8 py-4 rounded-2xl bg-secondary/50">
            <div
              className="flex flex-col w-full gap-2"
              onClick={() => copyToClipboard(wallet.publicKey)}
            >
              <span className="text-lg md:text-xl font-bold tracking-tighter">
                Public Key
              </span>
              <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                {wallet.publicKey}
              </p>
            </div>
            <div className="flex flex-col w-full gap-2">
              <span className="text-lg md:text-xl font-bold tracking-tighter">
                Private Key
              </span>
              <div className="flex justify-between w-full items-center gap-2">
                <p
                  onClick={() => copyToClipboard(wallet.privateKey)}
                  className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
                >
                  {visiblePrivateKey ? wallet.privateKey : "•".repeat(12)}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setVisiblePrivateKey(!visiblePrivateKey)}
                >
                  {visiblePrivateKey ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WalletGenerator;
