"use client";

import Navbar from "@/components/NavBar";
import React, { useState } from "react";
import { Wallet } from "@/utils/wallet";
import WalletDetails from "@/components/WalletDetails";
import WalletGenerator from "@/components/WalletGenerator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [walletEthereum, setWalletEthereum] = useState<Wallet | null>(null);
  const [walletSolana, setWalletSolana] = useState<Wallet | null>(null);
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
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
              setWalletEthereum(wallet);
            }}
          />
          <WalletDetails
            wallet={walletEthereum}
            network="Ethereum"
            onWalletDelete={() => {
              setWalletEthereum(null);
            }}
          />
        </TabsContent>
        <TabsContent value="Solana">
          <WalletGenerator
            wallet={walletSolana}
            network="Solana"
            onWalletCreated={(wallet) => {
              setWalletSolana(wallet);
            }}
          />
          <WalletDetails
            wallet={walletSolana}
            network="Solana"
            onWalletDelete={() => {
              setWalletSolana(null);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
