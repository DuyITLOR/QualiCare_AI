import React, { use, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import logoIcon from '../assets/quailcare-logo.png';
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import { authAPI } from '../services/authAPI';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Login form submitted", { userName, password });
        try {
            const result: string = await authAPI.login(userName, password);
            console.log(result)
            console.log("Login successful:", result);
            // localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result);

            navigate('/dashboard');
        } catch (error) {
            console.error("Login  haha error:", error);
            const errorMessage = error instanceof Error ? error.message : "Sai tên đăng nhập hoặc mật khẩu!";
            alert(errorMessage);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4 bg-[#F7F7F7] relative overflow-hidden'>
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-600 opacity-10" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-800 opacity-10" />

            <div className='w-full max-w-md z-10'>
                <button
                    onClick={() => navigate('/')}
                    className='inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors gap-1'>
                    <IoIosArrowRoundBack size={28} />
                    <p> Quay lại trang chủ</p>
                </button>

                <div className='bg-white shadow-xl rounded-2xl px-6 py-8'>
                    <div className='flex justify-center mb-4'>
                        <img src={logoIcon} alt="" className='h-15 w-15' />
                    </div>

                    <h2 className='text-2xl font-bold text-center text-green-700 mb-1'>Đăng nhập</h2>
                    <p className='text-center text-gray-500 text-sm mb-6'>
                        Chào mừng bạn quay trở lại với QuailCare AI
                    </p>



                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Email / Số điện thoại</label>
                            <input
                                id="email"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Nhập email hoặc số điện thoại của bạn"
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    required
                                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <BsFillEyeFill className="w-5 h-5" /> : <BsFillEyeSlashFill className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input type="checkbox" className="h-4 w-4 accent-blue-900" />
                                Ghi nhớ đăng nhập
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-yellow-500 hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>


                        <button
                            type="submit"
                            className="w-full h-12 bg-green-800 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Đăng nhập
                        </button>


                        <div className="relative text-center">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300" />
                            </div>
                            <span className="relative bg-white px-2 text-sm text-gray-500">Hoặc</span>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            <p>TK: Duy - MK: duy123</p>
                            Chưa có tài khoản?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="text-yellow-500 font-medium hover:underline"
                            >
                                Đăng ký ngay
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login