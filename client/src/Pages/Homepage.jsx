import React from 'react'
import Header from '../Components/header'
import banner from '../assets/quail-nest.png'

const HomePage = () => {
    return (
        <div>
            <Header />

            <div className='w-full bg-gradient-to-r from-[#804a2e] to-[#7d4229] text-white  pt-20 min-h-screen flex items-center'>
                <div className='mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 gap-10'>
                    <div className='flex-1'>
                        <h1 className='text-3xl font-extrabold md:text-6xl leading-tight mb-6'>
                            ĐƯA CÔNG NGHỆ <br /> ĐẾN TAY NHÀ NÔNG
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-200 mb-8">
                            Trở thành giải pháp công nghệ nông nghiệp thông minh đáng tin cậy và
                            dễ tiếp cận nhất cho các hộ chăn nuôi vừa và nhỏ, xuất phát từ nhu
                            cầu thực tế của người nuôi chim cút quy mô hộ gia đình.
                        </p>

                        <div className='flex space-x-4'>
                            <button className='px-6 py-3 bg-white text-black text-lg md:text-xl font-semibold rounded-lg shadow hover:bg-gray-100 transition'>
                                Về QUALICARE AI
                            </button>

                            <button className="px-6 py-3 border border-white text-white text-lg md:text-xl font-semibold rounded-lg hover:bg-white hover:text-black transition">
                                Tìm Hiểu Thêm →
                            </button>
                        </div>
                    </div>


                    <div className="flex-1 flex justify-center">
                        <img src={banner}
                            className='rounded-xl shadow-lg  object-cover h-[500px] w-[700px]' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
