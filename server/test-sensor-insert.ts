import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertTestData() {
  try {
    const result = await prisma.sensorData.create({
      data: {
        cageId: "CAGE-001",
        dateTime: new Date(),
        temperature: 28.5,
        humidity: 65.0,
        nh3: 15.0,
        windSpeed: 2.5,
      },
    });
    console.log("Test data inserted:", result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestData();
