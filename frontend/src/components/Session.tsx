import { Button } from "@telegram-apps/telegram-ui";
import React, { type BaseSyntheticEvent, useEffect, useState } from "react";

import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";

interface IInitialState {
  phoneNumber: string;
  password: string;
  phoneCode: string;
}

export function Session(): JSX.Element {
  const SESSION = new StringSession(
    JSON.parse(localStorage.getItem("session") || '""')
  ); // Get session from local storage
  const API_ID: number = parseInt(process.env.NEXT_PUBLIC_API_ID || "0", 10); // put your API id here
  const API_HASH: string = process.env.NEXT_PUBLIC_API_HASH || ""; // put your API hash here

  const client = new TelegramClient(SESSION, API_ID, API_HASH, {
    connectionRetries: 5,
  }); // Immediately create a client using your application data

  const initialState: IInitialState = {
    phoneNumber: "",
    password: "",
    phoneCode: "",
  }; // Initialize component initial state
  useEffect(() => {
    if (SESSION) {
      client.connect();
    }
  }, []);
  const [{ phoneNumber, password, phoneCode }, setAuthInfo] =
    useState<IInitialState>(initialState);

  async function sendCodeHandler(): Promise<void> {
    await client.connect(); // Connecting to the server
    await client.sendCode(
      {
        apiId: API_ID,
        apiHash: API_HASH,
      },
      phoneNumber
    );
  }

  async function clientStartHandler(): Promise<void> {
    await client.start({
      phoneNumber,
      password: userAuthParamCallback(password),
      phoneCode: userAuthParamCallback(phoneCode),
      onError: () => {},
    });
    localStorage.setItem("session", JSON.stringify(client.session.save())); // Save session to local storage

    await client.sendMessage("me", {
      message: "You're successfully logged in!",
    });
  }

  function inputChangeHandler({
    target: { name, value },
  }: BaseSyntheticEvent): void {
    setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }));
  }

  function userAuthParamCallback<T>(param: T): () => Promise<T> {
    return async function () {
      return await new Promise<T>((resolve) => {
        resolve(param);
      });
    };
  }

  return (
    <>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        onChange={inputChangeHandler}
      />

      <input
        type="text"
        name="password"
        value={password}
        onChange={inputChangeHandler}
      />

      <input type="button" value="start client" onClick={sendCodeHandler} />

      <input
        type="text"
        name="phoneCode"
        value={phoneCode}
        onChange={inputChangeHandler}
      />

      <input type="button" value="insert code" onClick={clientStartHandler} />
      <Button
        onClick={async () => {
          console.log(SESSION);

          console.log(
            await client.invoke(new Api.contacts.GetContacts({ hash: 0 }))
          );
        }}
      >
        Get all Contacts
      </Button>
    </>
  );
}
