import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaPaperPlane, FaRobot, FaUserCircle, FaChevronRight } from 'react-icons/fa';
import Header from '../Components/Header';

const Chatbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là QuailCare AI. Tôi đã được trang bị kiến thức chuyên sâu về chăn nuôi cút để hỗ trợ bạn. Bạn cần chia sẻ, hỏi đáp điều gì hôm nay?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { id: Date.now(), text: input, sender: 'user' };
      const botResponse = { id: Date.now() + 1, text: "Tính năng đang được phát triển.", sender: 'bot' };
      
      setMessages(prev => [...prev, userMessage, botResponse]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-16">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Chat History */}
        <aside className="w-1/4 bg-white border-r p-4 flex flex-col">
          <button className="flex items-center justify-center gap-2 w-full p-3 mb-4 text-lg font-semibold bg-[#193701] text-white rounded-lg hover:bg-green-900 transition-colors">
            <FaPlus /> Cuộc trò chuyện mới
          </button>
          <h2 className="text-lg font-bold text-[#ffc130] mb-2">Lịch sử</h2>
          <div className="flex-grow overflow-y-auto">
            <div className="p-3 bg-yellow-100 border border-[#ffc130] rounded-lg cursor-pointer">
              <p className="font-semibold text-gray-800 truncate">Cuộc trò chuyện mới</p>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </aside>

        {/* Center - Chat Area */}
        <main className="w-2/4 flex flex-col bg-gray-50">
          <div className="flex-grow p-6 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <FaRobot className="w-8 h-8 text-[#193701]" />}
                <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#193701] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                  <p>{msg.text}</p>
                </div>
                {msg.sender === 'user' && <FaUserCircle className="w-8 h-8 text-gray-400" />}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Đang chuẩn bị kiến thức, vui lòng đợi..."
                className="w-full py-3 pl-4 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc130]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#ffc130] text-[#193701] rounded-full hover:bg-yellow-500 transition-colors">
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>

        {/* Right Sidebar - AI Info */}
        <aside className="w-1/4 bg-white border-l p-6 flex flex-col items-center text-center">
            <FaRobot className="w-24 h-24 text-[#193701] mb-4" />
            <h2 className="text-2xl font-bold text-[#ffc130]">QuailCare AI</h2>
            <p className="text-gray-600 mb-6">Người bạn đồng hành của nhà nông</p>
            
            <div className="w-full text-left mb-6">
                <h3 className="font-bold text-[#ffc130] mb-2">Nguồn kiến thức:</h3>
                <p className="text-sm text-gray-500">Đang tải tài liệu...</p>
            </div>

            <div className="w-full text-left mb-6">
                <h3 className="font-bold text-[#ffc130] mb-2">Gợi ý câu hỏi:</h3>
                <p className="text-sm text-gray-500 p-2 rounded-md hover:bg-gray-100 cursor-pointer">- So sánh liều lượng...</p>
            </div>

            <button className="w-full mt-auto p-3 border-2 border-[#193701] text-[#193701] font-bold rounded-lg flex justify-between items-center hover:bg-[#193701] hover:text-white transition-colors">
                Trò chuyện với chuyên gia
                <FaChevronRight />
            </button>
        </aside>
      </div>
    </div>
  );
};

export default Chatbox;