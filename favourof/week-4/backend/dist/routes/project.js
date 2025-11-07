"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const projectValidation_1 = require("../validators/projectValidation");
const router = express_1.default.Router();
router.get("/", projectController_1.getAllProjects);
router.get("/:id", projectController_1.getProjectById);
router.post("/create", verifyAccessToken_1.verifyAccessToken, (0, validateRequest_1.default)(projectValidation_1.createProjectValidation), projectController_1.createProject);
router.patch("/update/:id", verifyAccessToken_1.verifyAccessToken, (0, validateRequest_1.default)(projectValidation_1.updateProjectValidation), projectController_1.updateProject);
router.delete("/delete/:id", verifyAccessToken_1.verifyAccessToken, projectController_1.deleteProject);
router.patch("/like/:id", verifyAccessToken_1.verifyAccessToken, projectController_1.toggleLikeProject);
exports.default = router;
