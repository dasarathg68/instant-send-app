"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Wallet } from "@/utils/wallet";
import { useInitData } from "@telegram-apps/sdk-react";
import instance from "@/utils/axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import Contacts from "@/components/Contacts";
import WalletDetails from "@/components/WalletDetails";
import WalletGenerator from "@/components/WalletGenerator";
import EthereumWallet from "@/components/EthereumWallet";

export default function Home() {
  const initData = useInitData();
  const [contacts, setContacts] = useState([]);
  const [walletEthereum, setWalletEthereum] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Ethereum_wallet`) || "null")
  );
  const [walletSolana, setWalletSolana] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Solana_wallet`) || "null")
  );

  const currentUser = useMemo(() => {
    console.log("Init data:", initData);
    return initData && initData.user
      ? {
          id: initData.user.id.toString(),
          username: initData.user.username,
          name: initData.user.firstName + " " + initData.user.lastName,
        }
      : undefined;
  }, [initData]);

  const getContacts = async () => {
    if (currentUser?.id) {
      const res = await instance.get(`/getContacts/${currentUser.id}`);
      setContacts(res.data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("Current user:", currentUser);
      getContacts();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-between space-y-0 pb-2 mt-2">
            <User className="h-4 w-4 text-muted-foreground" />

            <div className="text-2xl font-bold">{currentUser?.name}</div>
            <p className="text-xs text-muted-foreground">
              @{currentUser?.username}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Contacts contacts={contacts} handleRefresh={getContacts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crypto Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Ethereum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="Ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="Solana">Solana</TabsTrigger>
              </TabsList>
              <TabsContent value="Ethereum" className="space-y-4">
                <WalletGenerator
                  wallet={walletEthereum}
                  network="Ethereum"
                  onWalletCreated={(wallet) => {
                    localStorage.setItem(
                      `Ethereum_wallet`,
                      JSON.stringify(wallet)
                    );
                    setWalletEthereum(wallet);
                  }}
                />
                {walletEthereum && (
                  <>
                    <WalletDetails
                      wallet={walletEthereum}
                      network="Ethereum"
                      onWalletDelete={() => {
                        setWalletEthereum(null);
                        localStorage.removeItem(`Ethereum_wallet`);
                      }}
                    />
                    <EthereumWallet wallet={walletEthereum} />
                  </>
                )}
              </TabsContent>
              <TabsContent value="Solana" className="space-y-4">
                <WalletGenerator
                  wallet={walletSolana}
                  network="Solana"
                  onWalletCreated={(wallet) => {
                    localStorage.setItem(
                      `Solana_wallet`,
                      JSON.stringify(wallet)
                    );
                    setWalletSolana(wallet);
                  }}
                />
                {walletSolana && (
                  <WalletDetails
                    wallet={walletSolana}
                    network="Solana"
                    onWalletDelete={() => {
                      setWalletSolana(null);
                      localStorage.removeItem(`Solana_wallet`);
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
