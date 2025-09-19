import React from "react"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-green-900 border-green-950">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-green-100 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <div className="h-6 w-px bg-green-300" />
            <h1 className="text-xl font-bold text-white">Dashboard IoT - Chuồng Chim Cút</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-green-50 border-green-200 p-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-green-900 uppercase tracking-wider mb-4">GIÁM SÁT</div>
            <button className="w-full text-left text-green-950 bg-green-100 px-4 py-2 rounded">Tổng quan</button>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Nhiệt độ</button>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Độ ẩm</button>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Chất lượng không khí</button>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Thức ăn</button>

            <div className="text-xs font-semibold text-green-900 uppercase tracking-wider mt-8 mb-4">HỆ THỐNG</div>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Cảnh báo</button>
            <button className="w-full text-left text-green-900 hover:text-green-950 hover:bg-green-100 px-4 py-2 rounded">Cài đặt</button>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-6">
          <h2 className="text-lg font-bold text-green-900 mb-4">Tổng quan môi trường</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-green-200 rounded bg-white shadow-sm">
              <p className="text-sm text-green-900 font-medium">Nhiệt độ</p>
              <p className="text-2xl font-bold text-green-950">26.5°C</p>
              <p className="text-xs text-green-800">+2.1% so với hôm qua</p>
            </div>
            <div className="p-4 border border-green-200 rounded bg-white shadow-sm">
              <p className="text-sm text-green-900 font-medium">Độ ẩm</p>
              <p className="text-2xl font-bold text-green-950">62%</p>
              <p className="text-xs text-green-800">Trong mức bình thường</p>
            </div>
            <div className="p-4 border border-green-200 rounded bg-white shadow-sm">
              <p className="text-sm text-green-900 font-medium">NH3</p>
              <p className="text-2xl font-bold text-green-950">18 ppm</p>
              <p className="text-xs text-orange-600">Cần theo dõi</p>
            </div>
            <div className="p-4 border border-green-200 rounded bg-white shadow-sm">
              <p className="text-sm text-green-900 font-medium">Tốc độ gió</p>
              <p className="text-2xl font-bold text-green-950">3.2 m/s</p>
              <p className="text-xs text-green-800">Thông gió tốt</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-green-900 mb-4">Cảnh báo</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded bg-orange-50 border border-orange-200">
                <div>
                  <p className="text-sm font-medium text-orange-800">Nồng độ NH3 cao</p>
                  <p className="text-xs text-orange-600">Cần tăng cường thông gió</p>
                </div>
                <span className="text-xs text-orange-600">5 phút trước</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-green-25 border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-950">Thức ăn sắp hết</p>
                  <p className="text-xs text-green-800">Cần bổ sung thức ăn trong 2 ngày</p>
                </div>
                <span className="text-xs text-green-800">1 giờ trước</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-green-25 border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-950">Nhiệt độ ổn định</p>
                  <p className="text-xs text-green-800">Hệ thống hoạt động bình thường</p>
                </div>
                <span className="text-xs text-green-800">2 giờ trước</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
