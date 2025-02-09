"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lamda_controller_1 = __importDefault(require("../controllers/lamda.controller"));
const lamdaRoutes = express_1.default.Router();
lamdaRoutes.post('/lamda', new lamda_controller_1.default().createLamda);
lamdaRoutes.get('/lambda', new lamda_controller_1.default().getLamdasFunctions);
lamdaRoutes.get('/lambda/:name', new lamda_controller_1.default().getLamdaFunction);
lamdaRoutes.delete('/lambda/:name', new lamda_controller_1.default().deleteLamdaFunction);
lamdaRoutes.post('/lambda/:name/execute', new lamda_controller_1.default().executeLamdaFunction);
lamdaRoutes.get('/dependencies', new lamda_controller_1.default().getDependencies);
exports.default = lamdaRoutes;
//# sourceMappingURL=lamda.route.js.map