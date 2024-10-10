"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const contactRoutes = express_1.default.Router();
contactRoutes.get("/", (req, res) => {
    res.send("Hello from the contact routes!");
});
contactRoutes.get("/getContacts/:id", contactController_1.getContacts);
contactRoutes.delete("/deleteContact/:id", contactController_1.deleteContact);
exports.default = contactRoutes;
