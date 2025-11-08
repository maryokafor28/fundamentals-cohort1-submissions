"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const dotenv_1 = __importDefault(require("dotenv"));
const cookieParser = require("cookie-parser");
const auth_Routes_1 = __importDefault(require("./routers/auth.Routes"));
const project_routes_1 = __importDefault(require("./routers/project.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const MONGO_URI = process.env.MONGO_URI || "";
mongoose_1.default.connect(MONGO_URI, { dbName: "Devconnect" }).then(() => {
    console.log("connected");
});
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10kb" }));
app.use(cookieParser());
app.use((0, helmet_1.default)());
app.use("/api/auth", auth_Routes_1.default);
app.use("/api/project", project_routes_1.default);
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
