const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt cho chăn nuôi cút
    this.systemPrompt = `
Bạn là QuailCare AI - chuyên gia tư vấn chăn nuôi cút thông minh. Bạn có kiến thức chuyên sâu về:
- Kỹ thuật chăn nuôi cút (úm, nuôi thịt, đẻ trứng)
- Dinh dưỡng và thức ăn cho cút
- Phòng chống bệnh và chăm sóc sức khỏe
- Ứng dụng công nghệ IoT trong chăn nuôi
- Quản lý môi trường chuồng nuôi

Hãy trả lời bằng tiếng Việt, ngắn gọn, thực tế và dễ hiểu. Nếu câu hỏi không liên quan đến chăn nuôi cút, hãy từ chối một cách lịch sự và hướng dẫn người dùng hỏi về chủ đề phù hợp.
`;
  }

  async generateResponse(messages) {
    try {
      // Tạo context từ lịch sử chat (chỉ lấy 10 tin nhắn gần nhất)
      const recentMessages = messages.slice(-10);
      
      const chatHistory = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'Người dùng' : 'QuailCare AI'}: ${msg.content}`
      ).join('\n');

      const prompt = `${this.systemPrompt}\n\nLịch sử trò chuyện:\n${chatHistory}\n\nHãy trả lời câu hỏi mới nhất một cách hữu ích:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.');
    }
  }
}

module.exports = new GeminiService();