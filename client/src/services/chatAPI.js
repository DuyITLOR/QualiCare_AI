const API_BASE_URL = 'http://localhost:5000/api/chat';

export const chatAPI = {
  createSession: async (userId, title = 'Cuộc trò chuyện mới') => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  getSessions: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${userId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  },

  getMessages: async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  sendMessage: async (sessionId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};