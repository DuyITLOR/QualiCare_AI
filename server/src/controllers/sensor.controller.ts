import { Request, Response } from "express";
import * as sensorService from "../services/sensorService.js";

export const getLatest = async (req: Request, res: Response): Promise<void> => {
  try {
    const cageId = req.params.cageId as string;

    if (!cageId) {
      res.status(400).json({ error: "Cage ID is required" });
      return;
    }

    const data = await sensorService.getLatestSensorData(cageId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    if (error.message === "No sensor data found for this cage") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error fetching sensor data:", error);
      res.status(500).json({ error: "Failed to fetch sensor data" });
    }
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cageId = req.params.cageId as string;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!cageId) {
      res.status(400).json({ error: "Cage ID is required" });
      return;
    }

    const data = await sensorService.getSensorHistory(cageId, limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error fetching sensor history:", error);
    res.status(500).json({ error: "Failed to fetch sensor history" });
  }
};
