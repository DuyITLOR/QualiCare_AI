const API_BASE_URL = import.meta.env.VITE_API_BASE
  ? `${import.meta.env.VITE_API_BASE}/api`
  : "/api";

interface SensorData {
  id: number;
  cageId: string;
  temperature: number;
  humidity: number;
  nh3: number;
  windSpeed: number;
  dateTime: string;
}

export const sensorAPI = {
  getLatest: async (cageId: string): Promise<SensorData> => {
    const response = await fetch(`${API_BASE_URL}/sensors/latest/${cageId}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch sensor data");
    }

    return data.data;
  },

  getHistory: async (
    cageId: string,
    limit: number = 50,
  ): Promise<SensorData[]> => {
    const response = await fetch(
      `${API_BASE_URL}/sensors/history/${cageId}?limit=${limit}`,
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch sensor history");
    }

    return data.data;
  },
};
