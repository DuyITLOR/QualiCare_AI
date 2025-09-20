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

// đăng ký Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ title, labels, values, color = "rgb(75, 192, 192)" }) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: color.replace("1)", "0.3)").replace("rgb", "rgba"), // tạo màu fill nhạt
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: title },
    },
  };

  return (
    <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-green-900">{title}</h3>
      <div style={{ width: "100%", height: "300px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartCard;
