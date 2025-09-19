import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPlus, FaPaperPlane, FaRobot, FaUserCircle, 
  FaChevronRight, FaArrowLeft, FaBars, FaTimes
} from 'react-icons/fa';
import Header from '../Components/Header';
import { chatAPI } from '../services/chatAPI';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatList, setShowChatList] = useState(true); // Mobile: hiển thị danh sách chat
  const chatEndRef = useRef(null);

  const userId = 1;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await chatAPI.getSessions(userId);
      setSessions(sessionsData);
      
      // Desktop: tự động load session đầu tiên
      // Mobile: chỉ hiển thị danh sách
      if (sessionsData.length > 0 && window.innerWidth >= 768) {
        loadSession(sessionsData[0]);
      } else if (sessionsData.length === 0) {
        createNewSession();
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
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
      
      setMessages([
        {
          id: 'welcome',
          content: "Xin chào! Tôi là QuailCare AI. Tôi đã được trang bị kiến thức chuyên sâu về chăn nuôi cút để hỗ trợ bạn. Bạn cần chia sẻ, hỏi đáp điều gì hôm nay?",
          role: 'model',
          createdAt: new Date().toISOString()
        }
      ]);
      
      // Mobile: chuyển sang view chat
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
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
      
      // Mobile: chuyển sang view chat
      if (window.innerWidth < 768) {
        setShowChatList(false);
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
      
      setMessages(prev => {
        const withoutTemp = prev.filter(msg => msg.id !== tempUserMsg.id);
        return [...withoutTemp, result.userMessage, result.botMessage];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
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

  const getSessionPreview = (session) => {
    return session.title.length > 30 ? session.title.substring(0, 30) + '...' : session.title;
  };

  // Mobile Chat List View
  const ChatListView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#ffc130]">Trò chuyện AI</h2>
          <div className="flex items-center gap-2">
            <FaRobot className="w-6 h-6 text-[#193701]" />
          </div>
        </div>
        <button 
          onClick={createNewSession}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[#193701] text-white rounded-lg disabled:opacity-50"
        >
          <FaPlus /> Cuộc trò chuyện mới
        </button>
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FaRobot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm">Tạo cuộc trò chuyện mới để bắt đầu</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sessions.map(session => (
              <div 
                key={session.sessionId}
                onClick={() => loadSession(session)}
                className="bg-white p-4 rounded-lg shadow-sm active:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <FaRobot className="w-8 h-8 text-[#193701] mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate mb-1">
                      {getSessionPreview(session)}
                    </p>
                    <p className="text-sm text-gray-500">{formatTime(session.createdAt)}</p>
                  </div>
                  <FaChevronRight className="w-4 h-4 text-gray-400 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Chat View
  const ChatView = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <button 
          onClick={() => setShowChatList(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaArrowLeft className="text-[#193701]" />
        </button>
        <FaRobot className="w-8 h-8 text-[#193701]" />
        <div className="flex-1">
          <h3 className="font-bold text-[#ffc130]">QuailCare AI</h3>
          <p className="text-sm text-gray-500">Chuyên gia chăn nuôi cút</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id || msg.messageId} className={`flex items-end gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <FaRobot className="w-6 h-6 text-[#193701] mb-1 flex-shrink-0" />}
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#193701] text-white rounded-br-sm' 
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
            {msg.role === 'user' && <FaUserCircle className="w-6 h-6 text-gray-400 mb-1 flex-shrink-0" />}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-3 mb-4 justify-start">
            <FaRobot className="w-6 h-6 text-[#193701] mb-1" />
            <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm p-3">
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

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentSession || isTyping}
            placeholder={!currentSession ? "Đang tải..." : isTyping ? "AI đang trả lời..." : "Nhập câu hỏi..."}
            className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffc130] disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!currentSession || isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#ffc130] text-[#193701] rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </form>

        {/* Quick suggestions */}
        {messages.length <= 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Cách úm cút con hiệu quả?",
              "Thức ăn cho cút đẻ trứng?",
              "Phòng chống bệnh Newcastle?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-16">
      <Header />
      
      {/* Mobile View */}
      <div className="md:hidden flex-1">
        {showChatList ? <ChatListView /> : <ChatView />}
      </div>

      {/* Desktop View - giữ nguyên layout cũ */}
      <div className="hidden md:flex flex-grow overflow-hidden">
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