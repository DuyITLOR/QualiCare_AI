import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// HiveMQ Cloud config from environment variables
const MQTT_CONFIG = {
  host:
    process.env.MQTT_HOST ||
    "mqtts://700e6c8c95b64d528be62f3aef6394ae.s1.eu.hivemq.cloud",
  port: parseInt(process.env.MQTT_PORT || "8883"),
  username: process.env.MQTT_USERNAME || "QuailcareAI",
  password: process.env.MQTT_PASSWORD || "Abcd1234",
  rejectUnauthorized: false,
};

interface SensorData {
  temp: number;
  humi: number;
  mq135: number;
  wind: number;
  weight: number;
  fan: string;
}

class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  connect() {
    console.log("Connecting to MQTT broker...");

    this.client = mqtt.connect(MQTT_CONFIG.host, {
      port: MQTT_CONFIG.port,
      username: MQTT_CONFIG.username,
      password: MQTT_CONFIG.password,
      rejectUnauthorized: MQTT_CONFIG.rejectUnauthorized,
      keepalive: 60,
      reconnectPeriod: 5000,
    });

    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.reconnectAttempts = 0;

      // Subscribe to sensor topic
      this.client?.subscribe("sensors", (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        } else {
          console.log("Subscribed to sensors");
        }
      });
    });

    this.client.on("message", async (topic, message) => {
      try {
        const data: SensorData = JSON.parse(message.toString());
        console.log(`Received from ${topic}:`, data);

        // Save to database
        await this.saveSensorData(data);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    this.client.on("error", (error) => {
      console.error("MQTT Error:", error);
    });

    this.client.on("reconnect", () => {
      this.reconnectAttempts++;
      console.log(
        `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnect attempts reached");
        this.client?.end();
      }
    });

    this.client.on("close", () => {
      console.log("Disconnected from MQTT broker");
    });
  }

  private async saveSensorData(data: SensorData) {
    try {
      // TODO: Get cageId from device or use default
      const cageId = "CAGE-001";

      await prisma.sensorData.create({
        data: {
          cageId,
          dateTime: new Date(),
          temperature: data.temp,
          humidity: data.humi,
          nh3: data.mq135,
          windSpeed: data.wind,
        },
      });

      console.log("Saved sensor data to database");
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  }

  disconnect() {
    this.client?.end();
  }
}

// Singleton instance
const mqttService = new MQTTService();

export default mqttService;
