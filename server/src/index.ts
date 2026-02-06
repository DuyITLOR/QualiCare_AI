import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import mqttService from "./services/mqttClient.js";

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Start MQTT service
mqttService.connect();

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "QualiCare AI Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sensors", sensorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
