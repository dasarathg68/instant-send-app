"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Contact, Trash, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import instance from "@/utils/axios";
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

export default function Component(
  { contacts, handleRefresh }: ContactsProps = {
    contacts: [],
    handleRefresh: () => {},
  }
) {
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false);
  const handleDeleteContact = async (contactId: string) => {
    console.log("Deleting contact with id:", contactId);
    try {
      await instance.delete(`contacts/deleteContact/${contactId}`);
      toast.success("Contact deleted successfully");
      handleRefresh();
    } catch (err) {
      toast.error("Error deleting contact");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={isOpenCollapsible ? "open" : "closed"}
      className="flex flex-col space-y-2 mt-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="flex text-sm font-semibold">
          <Contact className="h-4 w-4" />
        </h4>
        <span>Contacts</span>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpenCollapsible(!isOpenCollapsible)}
          className="w-9 p-0"
        >
          <ChevronsUpDown className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpenCollapsible && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0, 0, 0.58, 1] }}
            className="flex flex-col space-y-2"
          >
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {contacts?.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between rounded-md border px-4 py-3 font-mono text-sm"
              >
                {contact.name}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex justify-center items-center cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </motion.div>
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
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            ))}
            <div className="flex items-center space-x-2 rounded-md border px-4 py-3 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span className="text-xs">
                To add more contacts, share a contact to @InstantSendAppBot
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
