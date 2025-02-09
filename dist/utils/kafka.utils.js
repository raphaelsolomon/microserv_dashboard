"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
require("dotenv/config");
const brokers = (process.env.KAFKA_BROKER_URLS).split(',');
class KafkaClient {
    constructor(appName, groupId = "microservice-group") {
        this.producer = undefined;
        this.consumer = undefined;
        const kafka = new kafkajs_1.Kafka({
            clientId: appName, brokers, retry: {
                initialRetryTime: 100, retries: 8
            }
        });
        this.producer = kafka.producer({
            allowAutoTopicCreation: false,
            transactionalId: `app-${appName}-${Date.now()}`,
            transactionTimeout: 30000,
            maxInFlightRequests: 1,
            idempotent: true
        });
        this.consumer = kafka.consumer({ groupId });
    }
    async produce(topic, messages) {
        await this.producer.connect();
        const transaction = await this.producer.transaction();
        try {
            await this.producer.send({ topic, messages });
            await transaction.commit();
        }
        catch (e) {
            await transaction.abort();
        }
        finally {
            this.producer.disconnect();
        }
    }
    async initConsumer(topics) {
        await this.consumer.connect();
        await this.consumer.subscribe({ topics, fromBeginning: true });
    }
    getConsumer() {
        return this.consumer;
    }
}
exports.default = KafkaClient;
module.exports = KafkaClient;
//# sourceMappingURL=kafka.utils.js.map