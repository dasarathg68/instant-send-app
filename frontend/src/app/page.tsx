"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet } from "@/utils/wallet";
import { useInitData } from "@telegram-apps/sdk-react";
import { Send, User } from "lucide-react";
import instance from "@/utils/axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Contacts from "@/components/Contacts";
import WalletDetails from "@/components/WalletDetails";
import WalletGenerator from "@/components/WalletGenerator";
import EthereumWallet from "@/components/EthereumWallet";
import { useWallet } from "@/contexts/WalletContext";

export default function Home() {
  const initData = useInitData();
  const [contacts, setContacts] = useState([]);
  const { walletEthereum, walletSolana, setWalletEthereum, setWalletSolana } =
    useWallet();

  const currentUser = useMemo(() => {
    if (!initData?.user) return undefined;
    const { id, username, firstName, lastName } = initData.user;
    return { id: id.toString(), username, name: `${firstName} ${lastName}` };
  }, [initData]);

  const getContacts = async () => {
    if (currentUser?.id) {
      const res = await instance.get(`contacts/getContacts/${currentUser.id}`);
      setContacts(res.data);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-between space-y-0 pb-2 mt-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {currentUser?.name}
            </motion.div>
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

              {(["Ethereum", "Solana"] as const).map((network) => {
                const wallet =
                  network === "Ethereum" ? walletEthereum : walletSolana;
                return (
                  <TabsContent
                    key={network}
                    value={network}
                    className="space-y-4"
                  >
                    <WalletGenerator
                      wallet={wallet}
                      network={network}
                      onWalletCreated={(wallet: Wallet) =>
                        network === "Ethereum"
                          ? setWalletEthereum(wallet)
                          : setWalletSolana(wallet)
                      }
                    />
                    {wallet && (
                      <>
                        <WalletDetails
                          wallet={wallet}
                          network={network}
                          onWalletDelete={() => {
                            network === "Ethereum"
                              ? setWalletEthereum(null)
                              : setWalletSolana(null);
                          }}
                        />
                        {network === "Ethereum" && (
                          <div className="mt-4 flex justify-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Stablecoins
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                {walletEthereum && (
                                  <EthereumWallet wallet={walletEthereum} />
                                )}
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
}
