// src/components/WalletDetails.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
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
import { Wallet } from "@/utils/wallet";

interface WalletDetailsProps {
  network: "Ethereum" | "Solana";
  wallet: Wallet | null;
  onWalletDelete: () => void;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({
  network,
  wallet,
  onWalletDelete,
}) => {
  const [visiblePrivateKey, setVisiblePrivateKey] = useState(false);

  if (!wallet) {
    return <p>No wallet found for {network}</p>;
  }

  const handleDeleteWallet = () => {
    localStorage.removeItem(`${network}_wallet`);
    onWalletDelete();
    toast.success(`${network.toUpperCase()} Wallet deleted successfully!`);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full gap-4 items-center">
        <h2 className="tracking-tighter text-3xl md:text-4xl font-extrabold">
          {network} Wallet
        </h2>
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
              This action cannot be undone. This will permanently delete your
              wallet and keys from local storage.
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
  );
};

export default WalletDetails;
