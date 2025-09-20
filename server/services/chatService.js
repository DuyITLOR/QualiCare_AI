// const { PrismaClient } = require('../generated/prisma');
const { PrismaClient } = require('@prisma/client');
const geminiService = require('./geminiService');

const prisma = new PrismaClient();

class ChatService {
  async createChatSession(userId, title = 'Cuộc trò chuyện mới') {
    try {
      const session = await prisma.chatSessions.create({
        data: {
          userId: BigInt(userId),
          title,
        }
      });
      return this.convertBigIntToString(session);
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error('Không thể tạo phiên chat mới');
    }
  }

  async getChatSessions(userId) {
    try {
      const sessions = await prisma.chatSessions.findMany({
        where: { userId: BigInt(userId) },
        orderBy: { createdAt: 'desc' },
        take: 20 // Lấy 20 session gần nhất
      });
      return sessions.map(session => this.convertBigIntToString(session));
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      throw new Error('Không thể tải lịch sử chat');
    }
  }

  async getChatMessages(sessionId) {
    try {
      const messages = await prisma.chatMessages.findMany({
        where: { sessionId: BigInt(sessionId) },
        orderBy: { createdAt: 'asc' }
      });
      return messages.map(msg => this.convertBigIntToString(msg));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw new Error('Không thể tải tin nhắn');
    }
  }

  async addMessage(sessionId, role, content) {
    try {
      const message = await prisma.chatMessages.create({
        data: {
          sessionId: BigInt(sessionId),
          role,
          content
        }
      });
      return this.convertBigIntToString(message);
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Không thể lưu tin nhắn');
    }
  }

  async sendMessage(sessionId, userMessage) {
    try {
      // Lưu tin nhắn người dùng
      const userMsg = await this.addMessage(sessionId, 'user', userMessage);

      // Lấy 10 tin nhắn gần nhất để tạo context
      const recentMessages = await prisma.chatMessages.findMany({
        where: { sessionId: BigInt(sessionId) },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // Đảo ngược để có thứ tự chronological
      const messages = recentMessages.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Gọi Gemini API
      const aiResponse = await geminiService.generateResponse(messages);

      // Lưu phản hồi AI
      const botMessage = await this.addMessage(sessionId, 'model', aiResponse);

      return {
        userMessage: userMsg,
        botMessage
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Lưu tin nhắn lỗi
      const errorMessage = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      const botMessage = await this.addMessage(sessionId, 'model', errorMessage);
      
      return {
        userMessage: null,
        botMessage,
        error: error.message
      };
    }
  }

  // Thêm method xóa session
  async deleteSession(sessionId) {
    try {
      // Xóa tất cả messages trước
      await prisma.chatMessages.deleteMany({
        where: { sessionId: BigInt(sessionId) }
      });
      
      // Xóa session
      await prisma.chatSessions.delete({
        where: { sessionId: BigInt(sessionId) }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Không thể xóa cuộc trò chuyện');
    }
  }

  // Thêm method xóa tất cả sessions của user
  async deleteAllSessions(userId) {
    try {
      // Lấy tất cả session IDs của user
      const sessions = await prisma.chatSessions.findMany({
        where: { userId: BigInt(userId) },
        select: { sessionId: true }
      });

      const sessionIds = sessions.map(s => s.sessionId);

      // Xóa tất cả messages của user
      await prisma.chatMessages.deleteMany({
        where: { sessionId: { in: sessionIds } }
      });

      // Xóa tất cả sessions của user
      await prisma.chatSessions.deleteMany({
        where: { userId: BigInt(userId) }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw new Error('Không thể xóa tất cả cuộc trò chuyện');
    }
  }

  async updateSessionTitle(sessionId, title) {
    try {
      const session = await prisma.chatSessions.update({
        where: { sessionId: BigInt(sessionId) },
        data: { title }
      });
      return this.convertBigIntToString(session);
    } catch (error) {
      console.error('Error updating session title:', error);
      throw new Error('Không thể cập nhật tiêu đề');
    }
  }

  // Helper method để convert BigInt thành string
  convertBigIntToString(obj) {
    if (obj === null || obj === undefined) return obj;
    
    const result = { ...obj };
    Object.keys(result).forEach(key => {
      if (typeof result[key] === 'bigint') {
        result[key] = result[key].toString();
      }
    });
    return result;
  }
}

module.exports = new ChatService();