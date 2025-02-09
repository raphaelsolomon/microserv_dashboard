"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const projectRoutes = express_1.default.Router();
projectRoutes.post('projects', new project_controller_1.default().createProject);
projectRoutes.get('projects/:projectId/services', new project_controller_1.default().getServices);
projectRoutes.post('projects/:projectId/services', new project_controller_1.default().enableServices);
projectRoutes.get('projects/:projectId/services', new project_controller_1.default().deleteServices);
exports.default = projectRoutes;
//# sourceMappingURL=project.route.js.map