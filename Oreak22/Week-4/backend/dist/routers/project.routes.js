"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const project_Controller_1 = require("../controllers/project.Controller");
const router = express_1.default.Router();
router.get("/view/:userName", project_Controller_1.viewProfie);
router.get("/getProject", auth_middleware_1.authenticate, project_Controller_1.getProject);
router.post("/new", auth_middleware_1.authenticate, project_Controller_1.newProject);
router.post("/newComment", auth_middleware_1.authenticate, project_Controller_1.newComment);
router.get("/getComments", auth_middleware_1.authenticate, project_Controller_1.getProject);
router.get("/:id", auth_middleware_1.authenticate, project_Controller_1.getOneProject);
router.post("/search", auth_middleware_1.authenticate, project_Controller_1.search);
exports.default = router;
