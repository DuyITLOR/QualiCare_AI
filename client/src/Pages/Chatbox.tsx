import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlus, FaPaperPlane, FaRobot, FaUserCircle,
  FaChevronRight, FaArrowLeft, FaBars, FaTimes,
  FaTrash, FaEllipsisV, FaCheck, FaEdit
} from 'react-icons/fa';
import Header from '../Components/Header';
import MarkdownRenderer from '../Components/MarkdownRenderer';
import { chatAPI } from '../services/chatAPI';
import Cookies from 'js-cookie';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const chatEndRef = useRef(null);

  const userId = Cookies.get('userId');
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

  const handleDeleteSession = async (sessionId) => {
    try {
      await chatAPI.deleteSession(sessionId);

      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));

      if (currentSession?.sessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s.sessionId !== sessionId);
        if (remainingSessions.length > 0) {
          loadSession(remainingSessions[0]);
        } else {
          createNewSession();
        }
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
    }
  };

  const handleClearAllSessions = async () => {
    try {
      await chatAPI.deleteAllSessions(userId);
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setShowClearAllConfirm(false);

      createNewSession();
    } catch (error) {
      console.error('Error clearing all sessions:', error);
      alert('Không thể xóa tất cả cuộc trò chuyện. Vui lòng thử lại.');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' - ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getSessionPreview = (session) => {
    return session.title.length > 30 ? session.title.substring(0, 30) + '...' : session.title;
  };

  // Mobile Chat List View với nút xóa bên phải
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

        <div className="space-y-2">
          <button
            onClick={createNewSession}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[#193701] text-white rounded-lg disabled:opacity-50"
          >
            <FaPlus /> Cuộc trò chuyện mới
          </button>

          {sessions.length > 0 && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="w-full flex items-center justify-center gap-2 p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <FaTrash /> Xóa tất cả
            </button>
          )}
        </div>
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
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="flex items-center p-4">
                  <FaRobot className="w-8 h-8 text-[#193701] flex-shrink-0" />
                  <div
                    className="flex-1 min-w-0 cursor-pointer ml-3"
                    onClick={() => loadSession(session)}
                  >
                    <p className="font-medium text-gray-800 truncate mb-1">
                      {getSessionPreview(session)}
                    </p>
                    <p className="text-sm text-gray-500">{formatTime(session.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(session.sessionId);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0 ml-2"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Chat View với markdown support
  const ChatView = () => (
    <div className="flex flex-col h-full relative">
      {/* FIXED Sticky Chat Header - luôn nằm trên đầu */}
      <div className="bg-white border-b p-4 flex items-center gap-3 fixed top-14 left-0 right-0 z-20 md:hidden">
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

      {/* Messages với padding-top để tránh header */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 pt-20">
        {messages.map(msg => (
          <div key={msg.id || msg.messageId} className={`flex items-end gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <FaRobot className="w-6 h-6 text-[#193701] mb-1 flex-shrink-0" />}
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                ? 'bg-[#193701] text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer content={msg.content} />
                </div>
              )}
            </div>
            {msg.role === 'user' && <FaUserCircle className="w-6 h-6 text-gray-400 mb-1 flex-shrink-0" />}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-3 mb-4 justify-start">
            <FaRobot className="w-6 h-6 text-[#193701] mb-1" />
            <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
        {/* Padding bottom để tránh input */}
        <div className="h-32"></div>
      </div>

      {/* FIXED Input ở bottom */}
      <div className="bg-white border-t p-4 fixed bottom-0 left-0 right-0 z-20 md:hidden">
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

      {/* Desktop View - với nút xóa bên phải */}
      <div className="hidden md:flex flex-grow overflow-hidden">
        {/* Left Sidebar - Chat History */}
        <aside className="w-1/4 bg-white border-r p-4 flex flex-col">
          <div className="space-y-2 mb-4">
            <button
              onClick={createNewSession}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full p-3 text-lg font-semibold bg-[#193701] text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              <FaPlus /> Cuộc trò chuyện mới
            </button>

            {sessions.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="flex items-center justify-center gap-2 w-full p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <FaTrash /> Xóa tất cả
              </button>
            )}
          </div>

          <h2 className="text-lg font-bold text-[#ffc130] mb-2">Lịch sử</h2>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.sessionId}
                  className={`p-3 mb-2 rounded-lg transition-colors group ${currentSession?.sessionId === session.sessionId
                      ? 'bg-yellow-100 border border-[#ffc130]'
                      : 'hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => loadSession(session)}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-semibold text-gray-800 truncate">{session.title}</p>
                      <p className="text-sm text-gray-600">{formatTime(session.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(session.sessionId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded text-sm transition-opacity ml-2 flex-shrink-0"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Chat Area với markdown */}
        <main className="w-2/4 flex flex-col bg-gray-50">
          <div className="flex-grow p-6 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id || msg.messageId} className={`flex items-end gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <FaRobot className="w-8 h-8 text-[#193701]" />}
                <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#193701] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <FaTrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa cuộc trò chuyện?</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDeleteSession(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <FaTrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa tất cả cuộc trò chuyện?</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa TẤT CẢ cuộc trò chuyện? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearAllConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearAllSessions}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;