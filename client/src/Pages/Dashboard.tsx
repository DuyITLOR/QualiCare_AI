import React, { useState, useEffect } from 'react'
import SensorCard from '../Components/SensorCard'
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import ChartCard from '../Components/ChartCard';
import { sensorAPI } from '../services/sensorAPI';

const Dashboard = () => {
    const [sensorData, setSensorData] = useState<any>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const cageId = 'CAGE-001'; // TODO: Get from user's cages

    // Fetch latest sensor data
    const fetchSensorData = async () => {
        try {
            const data = await sensorAPI.getLatest(cageId);
            setSensorData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setLoading(false);
        }
    };

    // Fetch sensor history for charts
    const fetchHistoryData = async () => {
        try {
            const data = await sensorAPI.getHistory(cageId, 20);
            setHistoryData(data.reverse()); // Reverse để hiển thị từ cũ đến mới
        } catch (error) {
            console.error('Error fetching history data:', error);
        }
    };

    // Polling every 5 seconds
    useEffect(() => {
        fetchSensorData();
        fetchHistoryData();
        const interval = setInterval(() => {
            fetchSensorData();
            fetchHistoryData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Prepare chart data
    const chartLabels = historyData.map((item) => {
        const date = new Date(item.dateTime);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

    const temperatureData = historyData.map((item) => item.temperature || 0);
    const humidityData = historyData.map((item) => item.humidity || 0);
    const nh3Data = historyData.map((item) => item.nh3 || 0);
    const windSpeedData = historyData.map((item) => item.windSpeed || 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Đang tải dữ liệu cảm biến...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <Sidebar />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-20 md:pl-70'>
                <SensorCard
                    label="Nhiệt độ"
                    data={sensorData ? `${sensorData.temperature}°C` : "N/A"}
                    alertText="Nhiệt độ bình thường"
                />
                <SensorCard
                    label="Độ ẩm"
                    data={sensorData ? `${sensorData.humidity}%` : "N/A"}
                    alertText="Giá trị an toàn"
                />
                <SensorCard
                    label="Nồng độ NH3"
                    data={sensorData ? `${sensorData.nh3} ppm` : "N/A"}
                    alertText={sensorData?.nh3 > 50 ? "Cần theo dõi" : "Tốt"}
                />
                <SensorCard
                    label="Tốc độ gió"
                    data={sensorData ? `${sensorData.windSpeed} m/s` : "N/A"}
                    alertText="Thông gió tốt"
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2  gap-6 p-6 pt-5 md:pl-70'>
                <ChartCard
                    title="Nhiệt độ (°C)"
                    labels={chartLabels}
                    values={temperatureData}
                    color="rgb(75,192,192)"
                />
                <ChartCard
                    title="Độ ẩm (%)"
                    labels={chartLabels}
                    values={humidityData}
                    color="rgb(37,99,235)"
                />
                <ChartCard
                    title="Nồng độ NH3 (ppm)"
                    labels={chartLabels}
                    values={nh3Data}
                    color="rgb(220,38,38)"
                />
                <ChartCard
                    title="Tốc độ gió (m/s)"
                    labels={chartLabels}
                    values={windSpeedData}
                    color="rgb(202,138,4)"
                />
            </div>
        </div>
    )
}

export default Dashboard