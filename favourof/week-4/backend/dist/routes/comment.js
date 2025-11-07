"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const commentValidator_1 = require("../validators/commentValidator");
const router = express_1.default.Router();
router
    .route("/:projectId")
    .post(verifyAccessToken_1.verifyAccessToken, (0, validateRequest_1.default)(commentValidator_1.createCommentSchema), commentController_1.createComment)
    .get(commentController_1.getCommentsForProject);
router
    .route("/comments/:id")
    .patch(verifyAccessToken_1.verifyAccessToken, (0, validateRequest_1.default)(commentValidator_1.createCommentSchema), commentController_1.updateComment)
    .delete(verifyAccessToken_1.verifyAccessToken, commentController_1.deleteComment);
exports.default = router;
