import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";


const TopBar = ({ title = "Chuồng Chim Cút", onRefresh }) => {
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeText = now.toLocaleTimeString("vi-VN", { hour12: false });
  const dateText = now.toLocaleDateString("vi-VN");

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 bg-green-900 text-white">
      <div className="mx-auto flex h-full max-w-screen items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-white/10"
            aria-label="Quay lại"
            onClick={() => (navigate("/"))}
          >
            <IoIosArrowRoundBack className="h-6 w-6" />
          </button>
          <h1 className="text-sm font-semibold md:text-base">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs md:text-sm">Trực tuyến</span>
          </div>

          <div className="text-[8px] opacity-90 md:block md:text-sm">
            {timeText} {dateText}
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-[8px] font-medium hover:bg-white/20 md:text-sm"
          >
            <LuRefreshCcw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
