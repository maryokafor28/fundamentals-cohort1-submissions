"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userContoller_1 = require("../controllers/userContoller");
const verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const userValidation_1 = require("../validators/userValidation");
const router = express_1.default.Router();
router.patch("/update", verifyAccessToken_1.verifyAccessToken, (0, validateRequest_1.default)(userValidation_1.updateUserValidation), userContoller_1.updateUserProfile);
exports.default = router;
