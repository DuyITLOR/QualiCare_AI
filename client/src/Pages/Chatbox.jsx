import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaPaperPlane, FaRobot, FaUserCircle, FaChevronRight } from 'react-icons/fa';
import Header from '../Components/Header';
import { chatAPI } from '../services/chatAPI';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Giả lập userId - trong thực tế sẽ lấy từ authentication
  const userId = 1;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load sessions khi component mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await chatAPI.getSessions(userId);
      setSessions(sessionsData);
      
      // Nếu có session, load session đầu tiên
      if (sessionsData.length > 0) {
        loadSession(sessionsData[0]);
      } else {
        // Nếu không có session nào, tạo session mới
        createNewSession();
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Tạo session mới nếu không load được
      createNewSession();
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setLoading(true);
      const newSession = await chatAPI.createSession(userId);
      setCurrentSession(newSession);
      setSessions(prev => [newSession, ...prev]);
      
      // Set tin nhắn chào mừng
      setMessages([
        {
          id: 'welcome',
          content: "Xin chào! Tôi là QuailCare AI. Tôi đã được trang bị kiến thức chuyên sâu về chăn nuôi cút để hỗ trợ bạn. Bạn cần chia sẻ, hỏi đáp điều gì hôm nay?",
          role: 'model',
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error creating new session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (session) => {
    try {
      setLoading(true);
      setCurrentSession(session);
      const messagesData = await chatAPI.getMessages(session.sessionId);
      
      // Nếu session rỗng, thêm tin nhắn chào mừng
      if (messagesData.length === 0) {
        setMessages([
          {
            id: 'welcome',
            content: "Xin chào! Tôi là QuailCare AI. Tôi đã được trang bị kiến thức chuyên sâu về chăn nuôi cút để hỗ trợ bạn. Bạn cần chia sẻ, hỏi đáp điều gì hôm nay?",
            role: 'model',
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSession || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    // Thêm tin nhắn user vào UI ngay lập tức
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      content: userMessage,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const result = await chatAPI.sendMessage(currentSession.sessionId, userMessage);
      
      // Cập nhật với tin nhắn từ server
      setMessages(prev => {
        // Loại bỏ tin nhắn tạm
        const withoutTemp = prev.filter(msg => msg.id !== tempUserMsg.id);
        // Thêm tin nhắn từ server
        return [...withoutTemp, result.userMessage, result.botMessage];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Thêm tin nhắn lỗi
      const errorMsg = {
        id: `error-${Date.now()}`,
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        role: 'model',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' - ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-16">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Chat History */}
        <aside className="w-1/4 bg-white border-r p-4 flex flex-col">
          <button 
            onClick={createNewSession}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full p-3 mb-4 text-lg font-semibold bg-[#193701] text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
          >
            <FaPlus /> Cuộc trò chuyện mới
          </button>
          <h2 className="text-lg font-bold text-[#ffc130] mb-2">Lịch sử</h2>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.sessionId}
                  onClick={() => loadSession(session)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    currentSession?.sessionId === session.sessionId 
                      ? 'bg-yellow-100 border border-[#ffc130]' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold text-gray-800 truncate">{session.title}</p>
                  <p className="text-sm text-gray-600">{formatTime(session.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Chat Area */}
        <main className="w-2/4 flex flex-col bg-gray-50">
          <div className="flex-grow p-6 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id || msg.messageId} className={`flex items-end gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <FaRobot className="w-8 h-8 text-[#193701]" />}
                <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#193701] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                  <p>{msg.content}</p>
                </div>
                {msg.role === 'user' && <FaUserCircle className="w-8 h-8 text-gray-400" />}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-3 my-4 justify-start">
                <FaRobot className="w-8 h-8 text-[#193701]" />
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-sm p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!currentSession || isTyping}
                placeholder={!currentSession ? "Đang tải..." : isTyping ? "AI đang trả lời..." : "Nhập câu hỏi về chăn nuôi cút..."}
                className="w-full py-3 pl-4 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc130] disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!currentSession || isTyping || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#ffc130] text-[#193701] rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
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
                <p className="text-sm text-gray-500">Chăn nuôi cút chuyên nghiệp</p>
                <p className="text-sm text-gray-500">Phòng chống bệnh tật</p>
                <p className="text-sm text-gray-500">Công nghệ IoT trong nông nghiệp</p>
            </div>

            <div className="w-full text-left mb-6">
                <h3 className="font-bold text-[#ffc130] mb-2">Gợi ý câu hỏi:</h3>
                <div 
                  className="text-sm text-gray-500 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => setInput("Cách úm cút con hiệu quả?")}
                >
                  - Cách úm cút con hiệu quả?
                </div>
                <div 
                  className="text-sm text-gray-500 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => setInput("Thức ăn cho cút đẻ trứng?")}
                >
                  - Thức ăn cho cút đẻ trứng?
                </div>
                <div 
                  className="text-sm text-gray-500 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => setInput("Phòng chống bệnh Newcastle?")}
                >
                  - Phòng chống bệnh Newcastle?
                </div>
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