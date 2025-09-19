import React from "react";
import { TbTemperature } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { TbAlarmSmoke } from "react-icons/tb";
import { FaWind } from "react-icons/fa6";
import { TbToolsKitchen } from "react-icons/tb";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";



const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 border-r border-green-100 bg-green-50 p-4 md:block">
      <nav className="space-y-6">
        {/* Nhóm GIÁM SÁT */}
        <div>
          <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-green-700/80">
            GIÁM SÁT
          </div>
          <ul className="space-y-1">
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <TbTemperature className="h-4 w-4" />
                <span>Nhiệt độ</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <WiHumidity className="h-4 w-4" />
                <span>Độ ẩm</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <FaWind className="h-4 w-4" />
                <span>Tốc độ gió</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <TbToolsKitchen className="h-4 w-4" />
                <span>Thức ăn</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Nhóm HỆ THỐNG */}
        <div>
          <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-green-700/80">
            HỆ THỐNG
          </div>
          <ul className="space-y-1">
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <IoWarningOutline className="h-4 w-4" />
                <span>Cảnh báo</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-green-900/80 hover:bg-white">
                <IoIosSettings className="h-4 w-4" />
                <span>Cài đặt</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
