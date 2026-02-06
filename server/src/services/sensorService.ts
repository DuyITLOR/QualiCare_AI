import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLatestSensorData = async (cageId: string) => {
  const latestData = await prisma.sensorData.findFirst({
    where: { cageId },
    orderBy: { dateTime: "desc" },
  });

  if (!latestData) {
    throw new Error("No sensor data found for this cage");
  }

  // Convert BigInt to Number for JSON serialization
  return {
    ...latestData,
    id: Number(latestData.id),
  };
};

export const getSensorHistory = async (cageId: string, limit: number = 50) => {
  const history = await prisma.sensorData.findMany({
    where: { cageId },
    orderBy: { dateTime: "desc" },
    take: limit,
  });

  // Convert BigInt to Number for JSON serialization
  return history.map((item) => ({
    ...item,
    id: Number(item.id),
  }));
};
