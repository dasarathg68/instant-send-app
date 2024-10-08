"use client";

import Navbar from "@/components/NavBar";
import React, { useState, useMemo, useEffect } from "react";

import { Wallet } from "@/utils/wallet";
import WalletDetails from "@/components/WalletDetails";
import WalletGenerator from "@/components/WalletGenerator";
import EthereumWallet from "@/components/EthereumWallet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useInitData } from "@telegram-apps/sdk-react";
import instance from "@/utils/axios";
import Contacts from "@/components/Contacts";

export default function Home() {
  const initData = useInitData();
  const [contacts, setContacts] = useState([]);

  const currentUser = useMemo(() => {
    return initData && initData.user
      ? {
          id: initData.user.id.toString(),
          username: initData.user.username,
          name: initData.user.firstName + " " + initData.user.lastName,
        }
      : undefined;
  }, [initData]);
  const getContacts = async () => {
    await instance.get(`/getContacts/${currentUser?.id}`).then((res) => {
      setContacts(res.data);
    });
  };
  useEffect(() => {
    if (currentUser) {
      console.log("Current user:", currentUser);
      getContacts();
    }
  }, []);
  const [walletEthereum, setWalletEthereum] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Ethereum_wallet`) || "null")
  );
  const [walletSolana, setWalletSolana] = useState<Wallet | null>(
    JSON.parse(localStorage.getItem(`Solana_wallet`) || "null")
  );
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      <Contacts
        contacts={contacts}
        handleRefresh={async () => {
          await getContacts();
        }}
      />

      <Tabs defaultValue="Ethereum">
        <TabsList className="grid w-full grid-cols-2">
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
          {walletEthereum ? (
            <EthereumWallet wallet={walletEthereum} />
          ) : (
            <div>Wallet not found</div>
          )}
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
