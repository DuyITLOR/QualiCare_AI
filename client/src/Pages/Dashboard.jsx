import React from 'react'
import SensorCard from '../Components/SensorCard'
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { TbAlarmSmoke } from "react-icons/tb";
import { FaWind } from "react-icons/fa6";
import TopBar from '../Components/Topbar';
import Sidebar from '../Components/Sidebar';





const Dashboard = () => {
    return (
        <div>
            <TopBar/>
            <Sidebar/>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-20 pl-70'>
                <SensorCard label="Nhiệt độ" Icon={TbTemperature} data="26.5oC" alertText="+2.1% so với hôm qua" />
                <SensorCard label="Độ ẩm" Icon={WiHumidity} data="62%" alertText="Giá trị an toàn" />
                <SensorCard label="Nồng độ NH3" Icon={TbAlarmSmoke} data="18ppm" alertText="Cần theo dõi" />
                <SensorCard label="Tốc độ gió" Icon={FaWind} data="3.2m/s" alertText="Thông gió tốt" />
            </div>
        </div>
    )
}

export default Dashboard