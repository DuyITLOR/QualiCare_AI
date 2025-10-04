import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

const DevicesPage = () => {
  const [cages, setCages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ cageName: "", claimCode: "" });
  const userId = localStorage.getItem("userId");

//   // Fetch cages
//   const fetchCages = async () => {
//     try {
//       const res = await fetch(`/api/cages/getEsp32?userId=${userId}`);
//       const data = await res.json();
//       if (res.ok) setCages(data.cages);
//     } catch (err) {
//       console.error("Error fetching cages:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCages();
//   }, []);

//   const handleAdd = async () => {
//     try {
//       const res = await fetch("/api/cages/addEsp32", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, userId }),
//       });
//       if (res.ok) {
//         setShowModal(false);
//         setForm({ cageName: "", claimCode: "" });
//         fetchCages();
//       }
//     } catch (err) {
//       console.error("Error adding cage:", err);
//     }
//   };

//   const handleDelete = async (cageId) => {
//     try {
//       const res = await fetch("/api/cages/deleteEsp32", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, cageId }),
//       });
//       if (res.ok) fetchCages();
//     } catch (err) {
//       console.error("Error deleting cage:", err);
//     }
//   };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="p-6 pt-20 md:pl-70">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Quản lý chuồng nuôi</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Thêm chuồng mới
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cages.map((c) => (
            <div
              key={c.cageId}
              className="bg-white rounded-lg shadow p-4 relative"
            >
              <h2 className="font-semibold">{c.cageName}</h2>
              <p className="text-sm text-gray-500">{c.cageId}</p>
              <div className="flex items-center mt-2 text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                Trực tuyến
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => (window.location.href = `/dashboard/${c.cageId}`)}
                >
                  Xem Dashboard
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(c.cageId)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Thêm chuồng nuôi mới</h2>
            <input
              type="text"
              placeholder="Tên chuồng"
              value={form.cageName}
              onChange={(e) => setForm({ ...form, cageName: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Claim Code"
              value={form.claimCode}
              onChange={(e) => setForm({ ...form, claimCode: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Thêm thiết bị
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
