// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import logoIcon from "../assets/quailcare-logo.png"
// import logoUser from "../assets/user.svg?react"
// import { IoMenu } from "react-icons/io5";
// import { CiUser } from "react-icons/ci";



// const Header = () => {
//     const navigate = useNavigate();

//     const [isOpen, setIsOpen] = useState(false);




//     return (
//         <div className='w-full bg-white shadow-sm fixed top-0 left-0 z-50'>
//             <div className='mx-auto flex items-center justify-between px-6 h-14 relative'>
//                 {/* logo  */}
//                 <div className='flex items-center space-x-2 cursor-pointer'
//                     onClick={() => navigate('/')}>
//                     <img src={logoIcon} className='h-10 w-10 rounded-full' />
//                     <span className='font-bold text-lg text-gray-800 pl-2'>QualiCare AI</span>
//                 </div>

//                 <div className='hidden md:flex items-center space-x-8 text-gray-700 font-medium'>
//                     <button onClick={() => navigate("/")} className="hover:text-green-800">
//                         Trang chủ
//                     </button>

//                     <button onClick={() => navigate("/service")} className='hover:text-green-800'>
//                         Dịch vụ
//                     </button>

//                     <button onClick={() => navigate("/chatbox")} className='hover:text-green-800'>
//                         Chat với AI
//                     </button>

//                     <button onClick={() => navigate("/forum")} className='hover:text-green-800'>
//                         Diễn đàn
//                     </button>

//                     <img src={logoUser} className='h-5 w-5' />

//                 </div>

//                 {/* Mobile view */}
//                 <div className='md:hidden flex-col items-center gap-2'>
//                     <button onClick={() => (setIsOpen(!isOpen))}>
//                         <IoMenu size={28} />
//                     </button>
//                 </div>

//                 {
//                     isOpen && (
//                         <div >
//                             <div className="fixed inset-0 bg-black/40 z-40  " onClick={() => setIsOpen(false)} />

//                             <nav className='absolute w-full md:hidden border-t border-gray-100 bg-white px-6 py-2 z-50'>
//                                 <button onClick={() => { navigate('/'); setIsOpen(false) }}
//                                     className='block w-full text-left py-2 text-gray-700 font-medium hover:text-brown-600'
//                                 >Trang chủ</button>

//                                 <button onClick={() => { navigate('/service'); setIsOpen(false) }}
//                                     className='block w-full text-left py-2 text-gray-700 font-medium hover:text-brown-600'
//                                 >
//                                     Dịch vụ
//                                 </button>

//                                 <button onClick={() => { navigate('/chatbox'); setIsOpen(false) }}
//                                     className='block w-full text-left py-2 text-gray-700 font-medium hover:text-brown-600'
//                                 >
//                                     Chat với AI
//                                 </button>

//                                 <button onClick={() => { navigate('/forum'); setIsOpen(false) }}
//                                     className='block w-full text-left py-2 text-gray-700 font-medium hover:text-brown-600'
//                                 >
//                                     Diễn đàn
//                                 </button>
//                             </nav>
//                         </div>
//                     )
//                 }


//             </div>
//         </div>
//     )
// }

// export default Header


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/quailcare-logo.png';
import logoUser from '../assets/user.svg'; // simple <img>, no ?react
import { IoMenu } from 'react-icons/io5';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        }
    }, [isOpen])


  return (
    <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      {/* make the bar relative + fixed height so dropdown aligns perfectly */}
      <div className="mx-auto flex items-center justify-between px-6 h-14 relative">
        {/* logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logoIcon} className="h-10 w-10 rounded-full" alt="QualiCare AI" />
          <span className="font-bold text-lg text-gray-800 pl-2">QualiCare AI</span>
        </div>

        {/* desktop nav */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-green-800">Trang chủ</button>
          <button onClick={() => navigate('/service')} className="hover:text-green-800">Dịch vụ</button>
          <button onClick={() => navigate('/chatbox')} className="hover:text-green-800">Chat với AI</button>
          <button onClick={() => navigate('/forum')} className="hover:text-green-800">Diễn đàn</button>
          <img src={logoUser} className="h-5 w-5" alt="User" />
        </div>

        {/* mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls="mobile-menu">
            <IoMenu size={28} />
          </button>
        </div>

        {/* mobile dropdown + overlay */}
        {isOpen && (
          <>
            {/* overlay dims page but not the menu */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />

            {/* dropdown anchored to this bar */}
            <nav
              id="mobile-menu"
              className="absolute left-0 right-0 top-full mt-2 md:hidden z-50
                         bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden"
            >
              <button
                onClick={() => { navigate('/'); setIsOpen(false); }}
                className="block w-full text-left px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Trang chủ
              </button>
              <button
                onClick={() => { navigate('/service'); setIsOpen(false); }}
                className="block w-full text-left px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Dịch vụ
              </button>
              <button
                onClick={() => { navigate('/chatbox'); setIsOpen(false); }}
                className="block w-full text-left px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Chat với AI
              </button>
              <button
                onClick={() => { navigate('/forum'); setIsOpen(false); }}
                className="block w-full text-left px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Diễn đàn
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

