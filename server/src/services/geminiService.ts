import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: string;
  content: string;
}

interface AIResult {
  content: string;
  sources?: any[];
  hasKnowledgeBase: boolean;
  responseType: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private systemPrompt: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    this.systemPrompt = `
Bạn là QuailCare AI - trợ lý thông minh chuyên về chăn nuôi cút và nông nghiệp.

Hãy trả lời bằng tiếng Việt, thân thiện và hữu ích. 
Với câu hỏi chuyên môn, hãy đưa ra lời khuyên chi tiết và thực tế.
Với câu hỏi thông thường, hãy trò chuyện một cách tự nhiên.
`;
  }

  async generateResponse(messages: Message[]): Promise<AIResult> {
    try {
      const chatHistory = messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      const userQuery = lastMessage?.content || "";

      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: this.systemPrompt }],
          },
          {
            role: "model",
            parts: [
              {
                text: "Xin chào! Tôi là QuailCare AI, trợ lý chuyên về chăn nuôi cút. Tôi có thể giúp gì cho bạn?",
              },
            ],
          },
          ...chatHistory,
        ],
      });

      const result = await chat.sendMessage(userQuery);
      const response = result.response;
      const text = response.text();

      return {
        content: text,
        sources: [],
        hasKnowledgeBase: false,
        responseType: "general",
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Không thể kết nối với AI service");
    }
  }
}

export const generateResponse = async (
  messages: Message[],
): Promise<AIResult> => {
  const service = new GeminiService();
  return service.generateResponse(messages);
};

export default new GeminiService();
