import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getContacts = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const contacts = await prisma.contacts.findMany({});
    const contactsWithStringIds = contacts.map((contact) => ({
      ...contact,
      id: contact.id.toString(),
      userId: contact.userId.toString(),
    }));

    res.json(contactsWithStringIds);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving contacts.");
  }
};
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;
    console.log(contactId);
    await prisma.contacts.delete({
      where: { id: BigInt(contactId) },
    });

    res.send("Contact deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting contact.");
  }
};
