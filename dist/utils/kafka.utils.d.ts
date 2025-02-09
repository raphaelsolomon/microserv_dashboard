import { Consumer, Message } from 'kafkajs';
import 'dotenv/config';
export default class KafkaClient {
    private producer;
    private consumer;
    constructor(appName: string, groupId?: string);
    produce(topic: string, messages: Message[]): Promise<void>;
    initConsumer(topics: string[]): Promise<void>;
    getConsumer(): Consumer;
}
