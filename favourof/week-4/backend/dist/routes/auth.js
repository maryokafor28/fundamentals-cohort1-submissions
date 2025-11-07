"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authContoller_1 = require("../controllers/authContoller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const userValidation_1 = require("../validators/userValidation");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(userValidation_1.registerUserValidation), authContoller_1.register);
router.post("/refresh", authContoller_1.refreshToken);
router.post("/login", (0, validateRequest_1.default)(userValidation_1.loginUserValidation), authContoller_1.login);
exports.default = router;
