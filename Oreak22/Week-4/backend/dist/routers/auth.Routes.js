"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_Controller_1 = require("../controllers/auth.Controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/register", auth_Controller_1.register);
router.post("/login", auth_Controller_1.login);
router.post("/refresh", auth_Controller_1.refreshToken);
router.post("/logout", auth_middleware_1.authenticate, auth_Controller_1.logout);
exports.default = router;
