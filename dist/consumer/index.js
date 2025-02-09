"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_utils_1 = __importDefault(require("../utils/kafka.utils"));
const kafkaClient = new kafka_utils_1.default("microservice-dashboard");
async function main() {
    await kafkaClient.initConsumer(["user.created"]);
    kafkaClient.getConsumer().run({
        eachMessage: async ({ message }) => {
            console.log(`Received message: ${JSON.stringify(message.value)}`);
        }
    });
}
main();
//# sourceMappingURL=index.js.map