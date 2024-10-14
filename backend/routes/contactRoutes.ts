import express from "express";
import { deleteContact, getContacts } from "../controllers/contactController";
import { authorizeUser } from "../middleware/authMiddleware";

const contactRoutes = express.Router();

contactRoutes.get("/", (req, res) => {
  res.send("Hello from the contact routes!");
});
contactRoutes.get("/getContacts/:id", authorizeUser, getContacts);
contactRoutes.delete("/deleteContact/:id", authorizeUser, deleteContact);

export default contactRoutes;
