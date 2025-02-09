"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LambdaSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    functionCode: { type: String, required: true },
    graphqlEndpoint: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastExecuted: { type: Date },
    executionCount: { type: Number, default: 0 }
});
exports.Lambda = mongoose_1.default.model('Lambda', LambdaSchema);
//# sourceMappingURL=lamda.model.js.map