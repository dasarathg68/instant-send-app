"use client";

import Navbar from "@/components/NavBar";
import WalletGenerator from "@/components/WalletGenerator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      <Tabs defaultValue="ethereum">
        <TabsList className="flex space-x-4 mb-6">
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
        </TabsList>
        <TabsContent value="ethereum">
          <WalletGenerator network="ethereum" />
        </TabsContent>
        <TabsContent value="solana">
          <WalletGenerator network="solana" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
