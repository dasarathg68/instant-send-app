"use client";

import { Section, Cell, Image, List } from "@telegram-apps/telegram-ui";

import { Link } from "@/components/Link/Link";

import tonSvg from "./_assets/ton.svg";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <List>
      <h1 className="text-3xl font-bold underline">Instant Send App</h1>
      <div>
        <Button>Click me</Button>
      </div>
      <Section
        header="Features"
        footer="You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects"
      >
        <Link href="/ton-connect">
          <Cell
            before={
              <Image src={tonSvg.src} style={{ backgroundColor: "#007AFF" }} />
            }
            subtitle="Connect your TON wallet"
          >
            TON Connect
          </Cell>
        </Link>
      </Section>
      <Section
        header="Application Launch Data"
        footer="These pages help developer to learn more about current launch information"
      >
        <Link href="/init-data">
          <Cell subtitle="User data, chat information, technical data">
            Init Data
          </Cell>
        </Link>
        <Link href="/launch-params">
          <Cell subtitle="Platform identifier, Mini Apps version, etc.">
            Launch Parameters
          </Cell>
        </Link>
        <Link href="/theme-params">
          <Cell subtitle="Telegram application palette information">
            Theme Parameters
          </Cell>
        </Link>
      </Section>
    </List>
  );
}
