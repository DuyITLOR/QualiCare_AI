import React from 'react'
import Header from '../Components/Header'
import Standard from '../assets/Standard.png'
import Premium from '../assets/Premium.png'
import PremiumPLus from '../assets/PremiumPlus.png'

const Services = () => {
    return (
        <div>
            <Header />

            <div className="w-full min-h-screen bg-[#193701] py-25 px-6">
                <div className="max-w-6xl mx-auto text-center text-[#ffc130] mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                        GÓI DỊCH VỤ IOT THÔNG MINH
                    </h2>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                        Lựa chọn gói dịch vụ phù hợp với nhu cầu chăn nuôi chim cút của bạn.
                        Tất cả các gói đều bao gồm hệ thống giám sát thông minh và hỗ trợ kỹ
                        thuật 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* --- Gói Standard --- */}
                    <div className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <h3 className="text-3xl font-bold text-[#ffc130] text-center mb-2">
                            Standard
                        </h3>
                        <p className="text-center text-sm text-gray-500 mb-6">(5 thiết bị)</p>

                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            <img src={Standard} className='h-50 w-50' />
                        </div>

                        <button className="w-full bg-[#7d4229] hover:bg-[#5c301f] text-white py-3 px-4 rounded-lg font-semibold transition">
                            Chọn gói Standard
                        </button>
                    </div>

                    {/* --- Gói Premium --- */}
                    <div className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <h3 className="text-3xl font-bold text-[#ffc130] text-center mb-2">
                            Premium
                        </h3>
                        <p className="text-center text-sm text-gray-500 mb-6">(6 thiết bị)</p>

                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            <img src={Premium} className='h-50 w-50' />
                        </div>

                        <button className="w-full bg-[#7d4229] hover:bg-[#5c301f] text-white py-3 px-4 rounded-lg font-semibold transition">
                            Chọn gói Premium
                        </button>
                    </div>

                    {/* --- Gói Premium Plus --- */}
                    <div className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <h3 className="text-2xl font-bold text-[#ffc130] text-center mb-2">
                            Premium Plus
                        </h3>
                        <p className="text-center text-sm text-gray-500 mb-6">(6 thiết bị + AI)</p>

                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            <img src={PremiumPLus} alt="" className='h-50 w-60' />
                        </div>

                        <button className="w-full bg-[#7d4229] hover:bg-[#5c301f] text-white py-3 px-4 rounded-lg font-semibold transition">
                            Chọn gói Premium Plus
                        </button>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto text-center text-white pt-25">
                    <h3 className="text-2xl font-bold mb-4">Cần tư vấn thêm?</h3>
                    <p className="text-lg text-gray-200 mb-6">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
                    </p>

                    <div className="flex justify-center">
                        <a
                            href="tel:19001234"
                            className="bg-white text-[#7d4229] font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                        >
                            Gọi ngay: 1900 1234
                        </a>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Services
