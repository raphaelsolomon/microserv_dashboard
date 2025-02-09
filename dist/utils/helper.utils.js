"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class helperUtils {
    generateApiKey(serviceId) {
        const servicePrefix = serviceId.substring(0, 3).toUpperCase();
        const randomBytes = crypto_1.default.randomBytes(16).toString('hex');
        return `${servicePrefix}_${randomBytes}`;
    }
}
//# sourceMappingURL=helper.utils.js.map