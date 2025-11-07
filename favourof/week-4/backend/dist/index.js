"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config/config");
const errorHandler_1 = require("./middlewares/errorHandler");
const request_logger_1 = require("./middlewares/request.logger");
const db_1 = require("./services/db");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const project_1 = __importDefault(require("./routes/project"));
const comment_1 = __importDefault(require("./routes/comment"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://dev-connect-frontend-two.vercel.app",
    ],
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(request_logger_1.requestLogger);
app.use("/api/auth", auth_1.default);
app.use("/api/profile", user_1.default);
app.use("/api/project", project_1.default);
app.use("/api/comment", comment_1.default);
app.get("/", (_, res) => {
    res.send({ massage: "server is running fine" });
});
app.all("*", (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler_1.globalErrorHandler);
const port = config_1.config.port;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app.listen(port, () => {
            console.log(`app is running on port:http://${config_1.config.nodeEnv}:${port}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};
startServer();
