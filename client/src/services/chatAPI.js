// const API_BASE_URL = 'http://localhost:5050/api/chat';
const API_BASE_URL = (import.meta.env?.VITE_API_BASE || '/api') + '/chat';

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Unknown error occurred');
  }
  return data.data;
};

// Helper function để tạo request options
const createRequestOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export const chatAPI = {
  // Tạo session mới
  createSession: async (userId, title = 'Cuộc trò chuyện mới') => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions`, 
        createRequestOptions('POST', { userId, title })
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error(`Không thể tạo phiên chat: ${error.message}`);
    }
  },

  // Lấy danh sách sessions
  getSessions: async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${userId}`,
        createRequestOptions('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw new Error(`Không thể tải lịch sử: ${error.message}`);
    }
  },

  // Lấy messages trong session
  getMessages: async (sessionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/messages`,
        createRequestOptions('GET')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error(`Không thể tải tin nhắn: ${error.message}`);
    }
  },

  // Gửi tin nhắn
  sendMessage: async (sessionId, message) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/messages`,
        createRequestOptions('POST', { message })
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(`Không thể gửi tin nhắn: ${error.message}`);
    }
  },

  // Cập nhật tiêu đề session
  updateSessionTitle: async (sessionId, title) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}`,
        createRequestOptions('PUT', { title })
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating session title:', error);
      throw new Error(`Không thể cập nhật tiêu đề: ${error.message}`);
    }
  },

  // XÓA MỘT SESSION
  deleteSession: async (sessionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}`,
        createRequestOptions('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error(`Không thể xóa cuộc trò chuyện: ${error.message}`);
    }
  },

  // XÓA TẤT CẢ SESSIONS CỦA USER
  deleteAllSessions: async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/user/${userId}`,
        createRequestOptions('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw new Error(`Không thể xóa tất cả cuộc trò chuyện: ${error.message}`);
    }
  },

  // Test connection để kiểm tra server
  testConnection: async () => {
    try {
      // const response = await fetch('http://localhost:5050/health');
      const response = await fetch((import.meta.env?.VITE_API_BASE || '/api') + '/health');
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error('Không thể kết nối đến server');
    }
  }
};