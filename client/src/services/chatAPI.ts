const API_BASE_URL = (import.meta.env?.VITE_API_BASE || "/api") + "/chat";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: APIResponse<T> = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Unknown error occurred");
  }
  return data.data!;
};

const createRequestOptions = (
  method: string = "GET",
  body: any = null,
): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export const chatAPI = {
  createSession: async (
    userId: string,
    title: string = "Cuộc trò chuyện mới",
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions`,
        createRequestOptions("POST", { userId, title }),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error(`Không thể tạo phiên chat: ${(error as Error).message}`);
    }
  },

  getSessions: async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${userId}`,
        createRequestOptions("GET"),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error getting sessions:", error);
      throw new Error(`Không thể tải lịch sử: ${(error as Error).message}`);
    }
  },

  getMessages: async (sessionId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/messages`,
        createRequestOptions("GET"),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error getting messages:", error);
      throw new Error(`Không thể tải tin nhắn: ${(error as Error).message}`);
    }
  },

  sendMessage: async (sessionId: string, message: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/messages`,
        createRequestOptions("POST", { message }),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(`Không thể gửi tin nhắn: ${(error as Error).message}`);
    }
  },

  updateSessionTitle: async (sessionId: string, title: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}`,
        createRequestOptions("PUT", { title }),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating session title:", error);
      throw new Error(
        `Không thể cập nhật tiêu đề: ${(error as Error).message}`,
      );
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}`,
        createRequestOptions("DELETE"),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error(
        `Không thể xóa cuộc trò chuyện: ${(error as Error).message}`,
      );
    }
  },

  deleteAllSessions: async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/user/${userId}`,
        createRequestOptions("DELETE"),
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      throw new Error(
        `Không thể xóa tất cả cuộc trò chuyện: ${(error as Error).message}`,
      );
    }
  },

  testConnection: async () => {
    try {
      const response = await fetch(
        (import.meta.env?.VITE_API_BASE || "/api") + "/health",
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Connection test failed:", error);
      throw new Error("Không thể kết nối đến server");
    }
  },
};
