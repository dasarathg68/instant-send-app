"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.getContacts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const contacts = yield prisma.contacts.findMany({});
        const contactsWithStringIds = contacts.map((contact) => (Object.assign(Object.assign({}, contact), { id: contact.id.toString(), userId: contact.userId.toString() })));
        res.json(contactsWithStringIds);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving contacts.");
    }
});
exports.getContacts = getContacts;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactId = req.params.id;
        console.log(contactId);
        yield prisma.contacts.delete({
            where: { id: BigInt(contactId) },
        });
        res.send("Contact deleted successfully.");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error deleting contact.");
    }
});
exports.deleteContact = deleteContact;
