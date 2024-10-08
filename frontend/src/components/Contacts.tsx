"use client";
import { ChevronsUpDown, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash } from "lucide-react";
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
} from "./ui/alert-dialog";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import axios from "axios";
import { toast } from "sonner";
interface Contact {
  id: string;
  name: string;
  username: string;
}
interface ContactsProps {
  contacts: Contact[];
  handleRefresh: () => void;
}

const Contacts = ({ contacts, handleRefresh }: ContactsProps) => {
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false);
  const handleDeleteWallet = async (contactId: string) => {
    console.log("Deleting wallet");
    try {
      await axios.delete(`http://localhost:8080/deleteContact/${contactId}`);

      toast.success("Contact deleted successfully");
      handleRefresh();
    } catch (err) {
      toast.error("Error deleting contact");
      console.error(err);
    }
  };
  return (
    <Collapsible
      open={isOpenCollapsible}
      onOpenChange={setIsOpenCollapsible}
      className="flex flex-col space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="flex text-sm font-semibold">
          <Contact className="h-4 w-4" />
        </h4>
        <span>Contacts</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        {contacts?.map((contact) => {
          return (
            <div
              key={(contact as any).id}
              className="flex justify-between rounded-md border px-4 py-3 font-mono text-sm"
            >
              {(contact as any).name}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-center items-center">
                    <Trash className="w-4 h-4" />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this contact?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete the contact from CTRL wallet.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteWallet((contact as any).id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Contacts;
