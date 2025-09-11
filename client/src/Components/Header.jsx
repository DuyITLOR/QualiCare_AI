import React from 'react'
import { useNavigate } from 'react-router-dom'
import logoIcon from "../assets/quailcare-logo.png"
import logoUser from "../assets/user.svg?react"

import { CiUser } from "react-icons/ci";



const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full bg-white shadow-sm fixed top-0 left-0 z-50'>
        <div className='mx-auto flex items-center justify-between px-6 py-3'>
            {/* logo  */}
            <div className='flex items-center space-x-2 cursor-pointer' 
                 onClick={() => navigate('/')}>
                <img src={logoIcon} className='h-10 w-10 rounded-full'/>
                <span className='font-bold text-lg text-gray-800 pl-2'>QualiCare AI</span>
            </div>

            <div className='hidden md:flex items-center space-x-8 text-gray-700 font-medium'>
                <button onClick={() => navigate("/")} className = "hover:text-brown-600">
                    Trang chủ
                </button>

                <button onClick = {() => navigate("/service")} className='hover:text-brown-600'>
                    Dịch vụ
                </button>

                <button onClick = {() => navigate("/chatbox")} className='hover:text-brown-600'>
                    Chat với AI
                </button>

                <button onClick = {() => navigate("/forum")} className='hover:text-brown-600'>
                    Diễn đàn
                </button>

                <img src={logoUser} className='h-5 w-5' />

            </div>
        </div>
    </div>
  )
}

export default Header
