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

      console.log('🚀 Processing message with enhanced AI service...');
      
      // Gọi Gemini API với Elasticsearch integration
      const aiResult = await geminiService.generateResponse(messages);

      // Lưu phản hồi AI với metadata
      const botMessage = await prisma.chatMessages.create({
        data: {
          sessionId: BigInt(sessionId),
          role: 'model',
          content: aiResult.content
        }
      });

      const convertedBotMessage = this.convertBigIntToString(botMessage);

      // Thêm metadata về response
      convertedBotMessage.sources = aiResult.sources;
      convertedBotMessage.hasKnowledgeBase = aiResult.hasKnowledgeBase;
      convertedBotMessage.responseType = aiResult.responseType;

      // Auto-update session title nếu là tin nhắn đầu tiên
      if (messages.length <= 2) {
        const title = userMessage.length > 50 ? 
          userMessage.substring(0, 50) + '...' : 
          userMessage;
        
        try {
          await this.updateSessionTitle(sessionId, title);
        } catch (titleError) {
          console.warn('Failed to update session title:', titleError);
        }
      }

      // Log thông tin response
      const responseInfo = {
        type: aiResult.responseType,
        hasKnowledgeBase: aiResult.hasKnowledgeBase,
        sourcesCount: aiResult.sources?.length || 0
      };
      
      console.log('✅ Message processed successfully:', responseInfo);
      
      // Emoji cho log dễ nhìn
      switch (aiResult.responseType) {
        case 'quail_expert':
          console.log('🎯 Used: Quail expertise with knowledge base');
          break;
        case 'quail_general':
          console.log('🐦 Used: Quail general knowledge (no KB)');
          break;
        case 'general':
          console.log('💬 Used: General conversation mode');
          break;
      }

      return {
        userMessage: userMsg,
        botMessage: convertedBotMessage
      };
    } catch (error) {
      console.error('❌ Error in sendMessage:', error);
      
      // Lưu tin nhắn lỗi với thông tin hữu ích hơn
      let errorMessage;
      
      if (error.message.includes('API key')) {
        errorMessage = '🔧 Có vấn đề với cấu hình AI. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = '⏰ Đã đạt giới hạn sử dụng AI. Vui lòng thử lại sau ít phút hoặc liên hệ hỗ trợ.';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = '🌐 Có vấn đề về kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
      } else {
        errorMessage = '⚠️ Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.';
      }
      
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