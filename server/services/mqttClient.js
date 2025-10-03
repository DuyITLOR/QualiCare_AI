const {PrismaClient} = require('@prisma/client');
const mqtt = require('mqtt');

const prisma = new PrismaClient();

const client = mqtt.connect('mqtt://localhost:1883', {
    username: 'CAGE-001',
    password: 'lenhutduy',
    keepalive: 60,
    reconnectPeriod: 2000,
    resubscribe: true,
});

client.on("connect", () => {
    console.log("MQTT connected to borker")

    client.subscribe("cages/CAGE-001/up", (err) => {
        if (!err)
        {
            console.log("Subscribed to cages/CAGE-001/up")
        } else {
            console.error("Failed to subscribe:", err)
        }
    })
})


client.on("message", async (topic, message) => { 
    try {
        const payload = JSON.parse(message.toString());
        console.log("Received message:", payload);
    }
    catch (error) {
        console.error("Error processing message:", error);
    }
})


client.on('reconnect', () => console.log('Reconnecting to MQTT broker...'));
client.on('close', () => console.log('Disconnected from MQTT broker'));
client.on('error', (error) => console.error('MQTT Error:', error));