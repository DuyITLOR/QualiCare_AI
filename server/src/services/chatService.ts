import { PrismaClient } from "@prisma/client";
import * as geminiService from "./geminiService.js";

const prisma = new PrismaClient();

interface Message {
  role: string;
  content: string;
  createdAt?: Date;
}

interface AIResult {
  content: string;
  sources?: any[];
  hasKnowledgeBase: boolean;
  responseType: string;
}

class ChatService {
  async createChatSession(
    userId: string,
    title: string = "Cuộc trò chuyện mới",
  ) {
    try {
      const session = await prisma.chatSessions.create({
        data: {
          userId: BigInt(userId),
          title,
        },
      });
      return this.convertBigIntToString(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw new Error("Không thể tạo phiên chat mới");
    }
  }

  async getChatSessions(userId: string) {
    try {
      const sessions = await prisma.chatSessions.findMany({
        where: { userId: BigInt(userId) },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      return sessions.map((session) => this.convertBigIntToString(session));
    } catch (error) {
      console.error("Error getting chat sessions:", error);
      throw new Error("Không thể tải lịch sử chat");
    }
  }

  async getChatMessages(sessionId: string) {
    try {
      const messages = await prisma.chatMessages.findMany({
        where: { sessionId: BigInt(sessionId) },
        orderBy: { createdAt: "asc" },
      });
      return messages.map((msg) => this.convertBigIntToString(msg));
    } catch (error) {
      console.error("Error getting chat messages:", error);
      throw new Error("Không thể tải tin nhắn");
    }
  }

  async addMessage(
    sessionId: string,
    role: "user" | "model" | "assistant",
    content: string,
  ) {
    try {
      const message = await prisma.chatMessages.create({
        data: {
          sessionId: BigInt(sessionId),
          role: role as any,
          content,
        },
      });
      return this.convertBigIntToString(message);
    } catch (error) {
      console.error("Error adding message:", error);
      throw new Error("Không thể lưu tin nhắn");
    }
  }

  async sendMessage(sessionId: string, userMessage: string) {
    try {
      const userMsg = await this.addMessage(sessionId, "user", userMessage);

      const recentMessages = await prisma.chatMessages.findMany({
        where: { sessionId: BigInt(sessionId) },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const messages: Message[] = recentMessages.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("Processing message with enhanced AI service...");

      const aiResult: AIResult = await geminiService.generateResponse(messages);

      const botMessage = await prisma.chatMessages.create({
        data: {
          sessionId: BigInt(sessionId),
          role: "model",
          content: aiResult.content,
        },
      });

      const convertedBotMessage: any = this.convertBigIntToString(botMessage);
      convertedBotMessage.sources = aiResult.sources;
      convertedBotMessage.hasKnowledgeBase = aiResult.hasKnowledgeBase;
      convertedBotMessage.responseType = aiResult.responseType;

      if (messages.length <= 2) {
        const title =
          userMessage.length > 50
            ? userMessage.substring(0, 50) + "..."
            : userMessage;

        try {
          await this.updateSessionTitle(sessionId, title);
        } catch (titleError) {
          console.warn("Failed to update session title:", titleError);
        }
      }

      console.log("Message processed successfully");

      return {
        userMessage: userMsg,
        botMessage: convertedBotMessage,
      };
    } catch (error) {
      console.error("❌ Error in sendMessage:", error);

      const errorMessage =
        "⚠️ Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.";
      const botMessage = await this.addMessage(
        sessionId,
        "model",
        errorMessage,
      );

      return {
        userMessage: null,
        botMessage,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async deleteSession(sessionId: string) {
    try {
      await prisma.chatMessages.deleteMany({
        where: { sessionId: BigInt(sessionId) },
      });

      await prisma.chatSessions.delete({
        where: { sessionId: BigInt(sessionId) },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Không thể xóa cuộc trò chuyện");
    }
  }

  async deleteAllSessions(userId: string) {
    try {
      const sessions = await prisma.chatSessions.findMany({
        where: { userId: BigInt(userId) },
        select: { sessionId: true },
      });

      const sessionIds = sessions.map((s) => s.sessionId);

      await prisma.chatMessages.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      await prisma.chatSessions.deleteMany({
        where: { userId: BigInt(userId) },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      throw new Error("Không thể xóa tất cả cuộc trò chuyện");
    }
  }

  async updateSessionTitle(sessionId: string, title: string) {
    try {
      const session = await prisma.chatSessions.update({
        where: { sessionId: BigInt(sessionId) },
        data: { title },
      });
      return this.convertBigIntToString(session);
    } catch (error) {
      console.error("Error updating session title:", error);
      throw new Error("Không thể cập nhật tiêu đề");
    }
  }

  convertBigIntToString(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    const result = { ...obj };
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === "bigint") {
        result[key] = result[key].toString();
      }
    });
    return result;
  }
}

export default new ChatService();
