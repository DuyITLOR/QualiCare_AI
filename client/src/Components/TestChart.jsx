import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Đăng ký bắt buộc (Chart.js v4 + react-chartjs-2 v5)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TestChart = () => {
  const data = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: [24, 23.8, 26, 28, 27, 25, 24],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.3, // làm mượt line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Biểu đồ nhiệt độ 24h" },
    },
  };

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TestChart;
