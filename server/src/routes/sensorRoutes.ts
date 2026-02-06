import { Router } from "express";
import * as sensorController from "../controllers/sensor.controller.js";

const router = Router();

// Get latest sensor data for a cage
router.get("/latest/:cageId", sensorController.getLatest);

// Get sensor history
router.get("/history/:cageId", sensorController.getHistory);

export default router;
