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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/contacts", contactRoutes_1.default);
app.use("/wallet", walletRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Server is running on port ${PORT}`);
        }));
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
startServer();
