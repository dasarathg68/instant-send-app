"use client";

import Navbar from "@/components/NavBar";
import React, { useState } from "react";
import { Wallet } from "@/utils/wallet";
import WalletDetails from "@/components/WalletDetails";
import WalletGenerator from "@/components/WalletGenerator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Session } from "@/components/Session";

export default function Home() {
  const [walletEthereum, setWalletEthereum] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Ethereum_wallet`) || "null")
  );
  const [walletSolana, setWalletSolana] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Solana_wallet`) || "null")
  );
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      <Session />
      <Tabs defaultValue="Ethereum">
        <TabsList className="flex space-x-4 mb-6">
          <TabsTrigger value="Ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="Solana">Solana</TabsTrigger>
        </TabsList>
        <TabsContent value="Ethereum">
          <WalletGenerator
            wallet={walletEthereum}
            network="Ethereum"
            onWalletCreated={(wallet) => {
              localStorage.setItem(`Ethereum_wallet`, JSON.stringify(wallet));
              setWalletEthereum(wallet);
            }}
          />
          <WalletDetails
            wallet={walletEthereum}
            network="Ethereum"
            onWalletDelete={() => {
              setWalletEthereum(null);
              localStorage.removeItem(`Ethereum_wallet`);
            }}
          />
        </TabsContent>
        <TabsContent value="Solana">
          <WalletGenerator
            wallet={walletSolana}
            network="Solana"
            onWalletCreated={(wallet) => {
              localStorage.setItem(`Solana_wallet`, JSON.stringify(wallet));
              setWalletSolana(wallet);
            }}
          />
          <WalletDetails
            wallet={walletSolana}
            network="Solana"
            onWalletDelete={() => {
              setWalletSolana(null);
              localStorage.removeItem(`Solana_wallet`);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
