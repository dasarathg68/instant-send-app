"use client";

import { useEffect, useState } from "react";
import { Wallet } from "@/utils/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the validation schema using zod
const formSchema = z.object({
  recipient: z
    .string()
    .min(2, { message: "Recipient address must be at least 2 characters." }),
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Amount must be a positive number.",
    }),
});

interface EthereumWalletProps {
  wallet: Wallet;
}

const EthereumWallet: React.FC<EthereumWalletProps> = ({ wallet }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  // Initialize react-hook-form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  // Submit handler
  const handleSendStablecoins = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(`Sending ${data.amount} stablecoins to ${data.recipient}`);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Send Stablecoins</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendStablecoins)}
            className="space-y-8"
          >
            {/* Recipient Address Field */}
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="recipient">Recipient TG handle</FormLabel>
                  <FormControl>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient TG handle"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount">Amount (USDT/USDC)</FormLabel>
                  <FormControl>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <Button type="submit" disabled={isLoading} className="w-full ">
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EthereumWallet;
