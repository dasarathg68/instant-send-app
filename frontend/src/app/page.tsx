"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Home() {
  const initData = useInitData();
  const [contacts, setContacts] = useState([]);
  const [walletEthereum, setWalletEthereum] = useState<Wallet | null>(() =>
    JSON.parse(localStorage.getItem(`Ethereum_wallet`) || "null")
  );
  const [walletSolana, setWalletSolana] = useState<Wallet | null>(() =>
    JSON.parse(localStorage.getItem(`Solana_wallet`) || "null")
  );

  const currentUser = useMemo(() => {
    if (!initData?.user) return undefined;
    const { id, username, firstName, lastName } = initData.user;
    return {
      id: id.toString(),
      username,
      name: `${firstName} ${lastName}`,
    };
  }, [initData]);

  const getContacts = async () => {
    if (currentUser?.id) {
      const res = await instance.get(`contacts/getContacts/${currentUser.id}`);
      setContacts(res.data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser]);

  const handleWalletCreation = (network: string) => (wallet: Wallet) => {
    localStorage.setItem(`${network}_wallet`, JSON.stringify(wallet));
    if (network === "Ethereum") setWalletEthereum(wallet);
    else if (network === "Solana") setWalletSolana(wallet);
  };

  const handleWalletDeletion = (network: string) => () => {
    localStorage.removeItem(`${network}_wallet`);
    if (network === "Ethereum") setWalletEthereum(null);
    else if (network === "Solana") setWalletSolana(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-between space-y-0 pb-2 mt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-2xl font-bold"
              >
                {currentUser?.name}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                @{currentUser?.username}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Contacts contacts={contacts} handleRefresh={getContacts} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
                <AnimatePresence mode="sync">
                  {(["Ethereum", "Solana"] as const).map((network) => {
                    const wallet =
                      network === "Ethereum" ? walletEthereum : walletSolana;
                    const handleCreation = handleWalletCreation(network);
                    const handleDeletion = handleWalletDeletion(network);

                    return (
                      <TabsContent
                        key={network}
                        value={network}
                        className="space-y-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <WalletGenerator
                            wallet={wallet}
                            network={network}
                            onWalletCreated={handleCreation}
                          />
                          {wallet && (
                            <>
                              <WalletDetails
                                wallet={wallet}
                                network={network}
                                onWalletDelete={handleDeletion}
                              />
                              {network === "Ethereum" && (
                                <div className="mt-4 flex justify-center">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <div>
                                        <Button variant="outline" size="sm">
                                          <Send className="h-4 w-4 mr-2" />
                                          Send Stablecoins
                                        </Button>
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      {walletEthereum && (
                                        <EthereumWallet
                                          wallet={walletEthereum}
                                        />
                                      )}
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      </TabsContent>
                    );
                  })}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
