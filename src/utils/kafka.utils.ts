import { Consumer, Kafka, Message, Producer } from 'kafkajs';
import 'dotenv/config'

// Create the client with the broker list

const brokers = (process.env.KAFKA_BROKER_URLS).split(',')

export default class KafkaClient {
    private producer: Producer = undefined;
    private consumer: Consumer = undefined;
    constructor(appName: string, groupId: string = "microservice-group") {
        const kafka = new Kafka({
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
        })
        this.consumer = kafka.consumer({ groupId })
    }

    async produce(topic: string, messages: Message[]){
        await this.producer.connect();
        const transaction = await this.producer.transaction()
        try {
            await this.producer.send({ topic, messages })
            await transaction.commit()
        } catch (e) {
            await transaction.abort()
        } finally {
            this.producer.disconnect();
        }
    }

    async initConsumer(topics: string[]) {
        await this.consumer.connect();
        await this.consumer.subscribe({ topics, fromBeginning: true })
    }

    getConsumer(): Consumer {
        return this.consumer;
    }
}

module.exports = KafkaClient