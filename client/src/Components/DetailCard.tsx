import React, { useState } from 'react'

const DetailCard = ({ label, priceMonth, priceNow, img, setIsOpen }) => {
    const [paymentType, setPaymentType] = useState('onetime'); // 'onetime' or 'monthly'

    return (
        <div className="max-w-2xl md:max-w-4xl mx-auto rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <h3 className="text-3xl md:text-5xl font-bold text-[#ffc130] text-center mb-2">
                {label}
            </h3>
            <p className="text-center text-sm md:text-xl text-gray-500 mb-6">Chọn hình thức thanh toán phù hợp với bạn</p>

            <div className='w-full flex justify-center'>
                <div className="inline-flex mb-6 bg-[#f5f6f7] rounded-2xl shadow-inner p-2">
                    <button
                        className={`px-4 py-2 rounded-l-lg font-semibold transition ${paymentType === 'onetime'
                            ? 'bg-[#7d4229] text-white rounded-l-2xl'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setPaymentType('onetime')}
                    >
                        Mua ngay
                    </button>

                    <button
                        className={`px-4 py-2 rounded-r-lg font-semibold transition ${paymentType === 'monthly'
                            ? 'bg-[#7d4229] text-white rounded-r-2xl'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setPaymentType('monthly')}
                    >
                        Thuê theo tháng
                    </button>
                </div>
            </div>

            <div className='w-full flex justify-center'>
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-6">
                    {/* Giá + tiện ích */}
                    <div className="pr-10">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">{paymentType === "onetime" ? priceNow : priceMonth}</div>
                        <div className="text-sm text-gray-600 mb-4">VNĐ</div>

                        <ul className="text-gray-700 space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-brown-600">●</span> Hệ thống giám sát 24/7
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-brown-600">●</span> Cảnh báo thông minh qua app
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-brown-600">●</span> Hỗ trợ kỹ thuật miễn phí
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-brown-600">●</span> {paymentType === "onetime" ? "Bảo hành 1 năm" : "Bảo trì định kì"}
                            </li>
                        </ul>
                    </div>

                    <div className='flex-1'>
                        <h3 className="text-lg font-semibold text-brown-600 mb-4">Thiết bị bao gồm:</h3>
                        <img src={img} className='w-50 h-50' />
                    </div>

                </div>

            </div>


            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    className="w-full sm:w-1/2 border-2 border-[#d8d8d8] bg-white text-[#333] py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
                    onClick={() => {
                        // Thêm logic điều hướng về trang chọn gói
                        setIsOpen(false);
                    }}
                >
                    Quay lại chọn gói
                </button>

                <button
                    className="w-full sm:w-1/2 bg-[#7d4229] hover:bg-[#5c301f] text-white py-3 px-4 rounded-lg font-semibold transition"
                    onClick={() => {
                        // Thêm logic đăng ký thuê
                        console.log("Đăng ký thuê");
                    }}
                >
                    {paymentType === 'onetime' ? "Mua ngay" : "Thuê theo tháng"}
                </button>
            </div>

        </div>
    )
}

export default DetailCard