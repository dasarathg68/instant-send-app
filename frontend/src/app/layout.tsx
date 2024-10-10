import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import Navbar from "@/components/NavBar";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import { ThemeProvider } from "@/components/themeprovider";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/contexts/WalletContext";

export const metadata: Metadata = {
  title: "Instant Send App by CTRL",
  description: "Instant Send App by CTRL",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <Toaster />
            <Root>
              <Navbar />
              {children}
            </Root>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
