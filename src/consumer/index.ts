import KafkaClient from "../utils/kafka.utils";

const kafkaClient = new KafkaClient("microservice-dashboard");

async function main() {
    await kafkaClient.initConsumer(["user.created"]);

    kafkaClient.getConsumer().run({
        eachMessage: async ({ message }) => {
            console.log(`Received message: ${JSON.stringify(message.value)}`);
        }
    });
}

main();