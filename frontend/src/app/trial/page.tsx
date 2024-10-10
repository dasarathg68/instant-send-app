"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Send, Wallet, Users, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInitData } from "@telegram-apps/sdk-react";
import { Wallet as WalletType } from "@/utils/wallet";
import instance from "@/utils/axios";

const ContactItem = React.memo(({ contact, isSelected, onSelect }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className={`flex items-center p-2 rounded-md cursor-pointer ${
      isSelected ? "bg-primary/10" : "hover:bg-primary/5"
    }`}
    onClick={() => onSelect(contact.id)}
  >
    <Avatar className="h-10 w-10">
      <AvatarImage
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`}
      />
      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="ml-3">
      <p className="font-medium">{contact.name}</p>
      <p className="text-sm text-muted-foreground">@{contact.username}</p>
    </div>
  </motion.div>
));

const WalletDetails = React.memo(({ wallet, network, onWalletDelete }) => {
  const [visiblePrivateKey, setVisiblePrivateKey] = useState(false);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
  };

  const handleDeleteWallet = () => {
    onWalletDelete();
    toast({
      title: "Wallet deleted",
      description: "Your wallet has been deleted successfully.",
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="wallet-details">
        <AccordionTrigger>
          <h2 className="text-xl font-semibold">{network} Wallet</h2>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Public Key</span>
              <div className="flex items-center gap-2">
                <Input
                  value={wallet.publicKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(wallet.publicKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Private Key</span>
              <div className="flex items-center gap-2">
                <Input
                  type={visiblePrivateKey ? "text" : "password"}
                  value={wallet.privateKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVisiblePrivateKey(!visiblePrivateKey)}
                >
                  {visiblePrivateKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(wallet.privateKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Wallet</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your wallet and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWallet}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

export default function InstantSendPage() {
  const initData = useInitData();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [amount, setAmount] = useState("");
  const [walletEthereum, setWalletEthereum] = useState<WalletType | null>(() =>
    JSON.parse(localStorage.getItem(`Ethereum_wallet`) || "null")
  );
  const [walletSolana, setWalletSolana] = useState<WalletType | null>(() =>
    JSON.parse(localStorage.getItem(`Solana_wallet`) || "null")
  );
  const [activeNetwork, setActiveNetwork] = useState<"Ethereum" | "Solana">(
    "Ethereum"
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
      try {
        const res = await instance.get(
          `contacts/getContacts/${currentUser.id}`
        );
        setContacts(res.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch contacts. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser]);

  const totalAmount = useMemo(() => {
    return (parseFloat(amount) * selectedContacts.length).toFixed(2);
  }, [amount, selectedContacts]);

  const handleContactSelect = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSend = () => {
    if (selectedContacts.length === 0 || !amount) {
      toast({
        title: "Error",
        description: "Please select contacts and enter an amount",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the actual send logic
    toast({
      title: "Success",
      description: `Sent ${totalAmount} ${
        activeNetwork === "Ethereum" ? "USDC" : "USDC-SPL"
      } to ${selectedContacts.length} contact(s)`,
    });
  };

  const handleWalletDelete = (network: "Ethereum" | "Solana") => {
    if (network === "Ethereum") {
      setWalletEthereum(null);
      localStorage.removeItem("Ethereum_wallet");
    } else {
      setWalletSolana(null);
      localStorage.removeItem("Solana_wallet");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2" />
              Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{100} USDC</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="ethereum" className="mb-6">
          <TabsList>
            <TabsTrigger
              value="ethereum"
              onClick={() => setActiveNetwork("Ethereum")}
            >
              Ethereum
            </TabsTrigger>
            <TabsTrigger
              value="solana"
              onClick={() => setActiveNetwork("Solana")}
            >
              Solana
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ethereum">
            {walletEthereum ? (
              <WalletDetails
                wallet={walletEthereum}
                network="Ethereum"
                onWalletDelete={() => handleWalletDelete("Ethereum")}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Create Ethereum Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      /* Implement wallet creation logic */
                    }}
                  >
                    Create Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="solana">
            {walletSolana ? (
              <WalletDetails
                wallet={walletSolana}
                network="Solana"
                onWalletDelete={() => handleWalletDelete("Solana")}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Create Solana Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      /* Implement wallet creation logic */
                    }}
                  >
                    Create Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Select Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {contacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContacts.includes(contact.id)}
                    onSelect={handleContactSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2" />
              Send Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-right"
              />
              <Select
                defaultValue={
                  activeNetwork === "Ethereum" ? "USDC" : "USDC-SPL"
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={activeNetwork === "Ethereum" ? "USDC" : "USDC-SPL"}
                  >
                    {activeNetwork === "Ethereum" ? "USDC" : "USDC-SPL"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Total: {totalAmount}{" "}
              {activeNetwork === "Ethereum" ? "USDC" : "USDC-SPL"} for{" "}
              {selectedContacts.length} contact(s)
            </p>
          </CardContent>
        </Card>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSend}
            className="w-full"
            size="lg"
            disabled={
              !amount ||
              selectedContacts.length === 0 ||
              (activeNetwork === "Ethereum" ? !walletEthereum : !walletSolana)
            }
          >
            Send Instantly
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
