import React from 'react'
import SensorCard from '../Components/SensorCard'
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { TbAlarmSmoke } from "react-icons/tb";
import { FaWind } from "react-icons/fa6";
import TopBar from '../Components/Topbar';
import Sidebar from '../Components/Sidebar';
import TestChart from '../Components/TestChart';
import ChartCard from '../Components/ChartCard';


const labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

const Dashboard = () => {
    return (
        <div>
            <TopBar />
            <Sidebar />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-20 md:pl-70'>
                <SensorCard label="Nhiệt độ" Icon={TbTemperature} data="26.5oC" alertText="+2.1% so với hôm qua" />
                <SensorCard label="Độ ẩm" Icon={WiHumidity} data="62%" alertText="Giá trị an toàn" />
                <SensorCard label="Nồng độ NH3" Icon={TbAlarmSmoke} data="18ppm" alertText="Cần theo dõi" />
                <SensorCard label="Tốc độ gió" Icon={FaWind} data="3.2m/s" alertText="Thông gió tốt" />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2  gap-6 p-6 pt-5 md:pl-70'>
                <ChartCard
                    title="Nhiệt độ (°C)"
                    labels={labels}
                    values={[24, 23.8, 26, 28, 27, 25, 24]}
                    color="rgb(75,192,192)"
                />
                <ChartCard
                    title="Độ ẩm (%)"
                    labels={labels}
                    values={[65, 67, 62, 59, 61, 64, 66]}
                    color="rgb(37,99,235)"
                />
                <ChartCard
                    title="Nồng độ NH3 (ppm)"
                    labels={labels}
                    values={[12, 14, 18, 23, 19, 16, 13]}
                    color="rgb(220,38,38)"
                />
                <ChartCard
                    title="Tốc độ gió (m/s)"
                    labels={labels}
                    values={[2, 1.8, 3, 4.2, 3.6, 2.8, 2.2]}
                    color="rgb(202,138,4)"
                />
            </div>
        </div>
    )
}

export default Dashboard