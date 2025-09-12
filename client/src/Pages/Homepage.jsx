import React from 'react'
import Header from '../Components/Header'
import banner from '../assets/quail-nest.png'
import { GrTechnology } from "react-icons/gr";
import { ImUserTie } from "react-icons/im";
import { CiCircleCheck } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { MdLocalAtm } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi2";


const HomePage = () => {
    return (
        <div className='bg-gray-50'>
            <Header />
            {/* bg-gradient-to-r from-[#804a2e] to-[#7d4229] */}
            <div className='w-full bg-[#193701] text-white  pt-20 min-h-screen flex items-center'>
                <div className='mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 gap-10'>
                    <div className='flex-1'>
                        <h1 className='text-3xl text-[#ffc130] font-extrabold md:text-6xl leading-tight mb-6'>
                            NÂNG TẦM CHĂN NUÔI <br/> MỞ LỐI THÀNH CÔNG
                        </h1>

                        <p className="text-lg md:text-xl text-gray-200 leading-9 mb-8">
                         Trở thành giải pháp công nghệ nông nghiệp thông minh, đáng tin cậy và dễ tiếp cận, đồng hành cùng nông dân nâng tầm giá trị nông sản Việt.
                        </p>

                        <div className='flex space-x-4'>
                            <button
                                onClick={() => {
                                    const element = document.getElementById('about');
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className='px-6 py-3 border border-white text-white text-lg md:text-xl font-semibold rounded-lg hover:bg-white hover:text-black transition'>
                                Về QUALICARE AI
                            </button>

                            <button
                                onClick={() => {
                                    const element = document.getElementById('detail');
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-6 py-3 border border-white text-white text-lg md:text-xl font-semibold rounded-lg hover:bg-white hover:text-black transition">
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



            <div id="about" className='w-full bg-gray-50 py-20'>
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl text-[#ffc130] font-bold text-brown-700 mb-6">
                        PHÁT TRIỂN HOẠT ĐỘNG CHĂN NUÔI THÔNG MINH
                    </h2>
                    <p className="text-lg text-gray-600">
                        QuailCare AI là một startup tiên phong trong lĩnh vực công nghệ nông nghiệp và chăn nuôi tại Việt Nam.
                        Chúng tôi nổi bật với việc ứng dụng IoT và trí tuệ nhân tạo vào giám sát – quản lý trang trại, mang đến giải pháp thông minh, dễ triển khai và chi phí tối ưu hơn so với các sản phẩm nhập khẩu đắt đỏ hay thiết bị trong nước còn hạn chế.
                        Với lợi thế công nghệ và mức giá phù hợp thực tế nông hộ, chúng tôi cam kết đồng hành cùng bà con trên con đường phát triển chăn nuôi bền vững, hiện đại.
                    </p>
                </div>
            </div>


            <div id="detail" className='flex flex-col justify-between'>
                <div className='className="w-full bg-[#193701] text-[#ffc130] py-16'>
                    <div className='mx-auto px-6'>
                        <h2 className="text-3xl text-[#ffc130] md:text-4xl font-bold text-center mb-12">
                            VÌ SAO CHỌN QUAILCARE AI
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white text-center rounded-xl shadow-lg p-8 hover:scale-105 transition-transform">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-orange-100 p-4 rounded-full">
                                        <GrTechnology className="text-orange-600 text-3xl" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#ffc130] mb-3">
                                    CÔNG NGHỆ TIÊN TIẾN
                                </h3>
                                <p className="text-gray-600">
                                    Hệ thống AI thông minh giám sát 24/7, cảnh báo sớm các vấn đề về
                                    sức khỏe và môi trường chăn nuôi.
                                </p>
                            </div>

                            <div className="bg-white text-center rounded-xl shadow-lg p-8 hover:scale-105 transition-transform">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-orange-100 p-4 rounded-full">
                                        <ImUserTie className="text-orange-600 text-3xl" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#ffc130] mb-3">
                                    HỖ TRỢ CHUYÊN NGHIỆP
                                </h3>
                                <p className="text-gray-600">
                                    Đội ngũ chuyên gia tư vấn 24/7, hướng dẫn chi tiết từ khâu thiết
                                    lập đến vận hành hệ thống.
                                </p>
                            </div>


                            <div className="bg-white text-center rounded-xl shadow-lg p-8 hover:scale-105 transition-transform">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-orange-100 p-4 rounded-full">
                                        <CiCircleCheck className="text-orange-600 text-3xl" style={{ strokeWidth: 2 }} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#ffc130] mb-3">
                                    5 NĂM KINH NGHIỆM
                                </h3>
                                <p className="text-gray-600">
                                    Với kinh nghiệm 5 năm trong lĩnh vực chăn nuôi, chúng tôi hiểu rõ
                                    nhu cầu của người nông dân.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Part 2 */}
                <div className='w-full py-12'>
                    <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 px-6'>

                        {/* card1 */}
                        <div className="bg-[#193701] text-white text-center rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <FaShoppingCart className="text-white text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-lg text-[#ffc130] font-semibold">Miễn phí tư vấn</h3>
                        </div>

                        {/* card_2 */}
                        <div className="bg-[#193701] text-white text-center rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <CiCircleCheck className="text-white text-3xl" style={{ strokeWidth: 2 }} />
                                </div>
                            </div>
                            <h3 className="text-lg text-[#ffc130] font-semibold">Bảo hành 1 năm</h3>
                        </div>

                        {/* card_3 */}
                        <div className="bg-[#193701] text-white text-center rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <MdLocalAtm className="text-white text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-lg text-[#ffc130] font-semibold">Thanh toán linh hoạt</h3>
                        </div>

                        {/* card_4 */}
                        <div className="bg-[#193701] text-white text-center rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <FaRegClock className="text-white text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-lg text-[#ffc130] font-semibold">Hỗ trợ 24/7</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* TẦM NHÌN VÀ SỨ MỆNH */}
            <div className='w-full py-18'>
                <div className='max-w-6xl mx-auto px-6'>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#ffc130] mb-12">
                        TẦM NHÌN - SỨ MỆNH
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        <div>
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <FaEye className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">Tầm nhìn</h3>
                            <p className="text-gray-600">
                                QuailCare AI với tầm nhìn trở thành doanh nghiệp đầu ngành về hợp tác quốc tế,
                                trở thành top 10 thương hiệu chăn nuôi thông minh Việt Nam.
                            </p>
                        </div>


                        <div>
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <CiHeart className="text-orange-600 text-3xl" style={{ strokeWidth: 2 }} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">Sứ mệnh</h3>
                            <p className="text-gray-600">
                                Lợi ích của người sử dụng và đối tác là trung tâm, luôn cam kết chất lượng cao,
                                phù hợp với người tiêu dùng.
                            </p>
                        </div>


                        <div>
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <FaRegLightbulb className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">Giá trị cốt lõi</h3>
                            <p className="text-gray-600">
                                Chính trực – ham học hỏi – khoa học – tập trung – kiên định – chia sẻ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* ĐA DẠNG GIẢI PHÁP */}
            <div className='w-full py-20'>
                <div className='max-w-6xl mx-auto px-6'>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#ffc130] mb-12">
                        ĐA DẠNG GIẢI PHÁP
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border-2 border-orange-200 rounded-xl p-8 text-center hover:shadow-lg transition">
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <FaHandshake className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">
                                HỢP TÁC ĐẠI LÝ BÁN LẺ
                            </h3>
                            <p className="text-gray-600">
                                Hợp tác với chúng tôi và trở thành đại lý phân phối sản phẩm.
                            </p>
                        </div>

                        <div className="border-2 border-orange-200 rounded-xl p-8 text-center hover:shadow-lg transition">
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <MdOutlineProductionQuantityLimits className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">
                                SẢN PHẨM QUAILCARE AI
                            </h3>
                            <p className="text-gray-600">
                                Với giá thành phải chăng và chất lượng cao phù hợp với mọi quy mô.
                            </p>
                        </div>

                        <div className="border-2 border-orange-200 rounded-xl p-8 text-center hover:shadow-lg transition">
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <BsFillLightningChargeFill className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">
                                CÔNG NGHỆ ƯU VIỆT
                            </h3>
                            <p className="text-gray-600">
                                Với công nghệ sản xuất hiện đại và quy trình kiểm soát chất lượng nghiêm ngặt.
                            </p>
                        </div>

                        <div className="border-2 border-orange-200 rounded-xl p-8 text-center hover:shadow-lg transition">
                            <div className="flex justify-center mb-4">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <HiOutlineNewspaper  className="text-orange-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#7d4229] mb-3">
                                TÀI LIỆU KỸ THUẬT
                            </h3>
                            <p className="text-gray-600">
                                Với kho tài liệu phong phú, hướng dẫn chi tiết và dễ hiểu.
                            </p>
                        </div>

                    </div>

                </div>
            </div>


        </div>
    )
}

export default HomePage
