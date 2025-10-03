const { GoogleGenerativeAI } = require('@google/generative-ai');
const elasticsearchService = require('./elasticsearchService');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // System prompt cho QuailCare AI
    this.systemPrompt = `
Bạn là QuailCare AI - trợ lý thông minh chuyên về chăn nuôi cút và nông nghiệp.

Hãy trả lời bằng tiếng Việt, thân thiện và hữu ích. 
Với câu hỏi chuyên môn, hãy đưa ra lời khuyên chi tiết và thực tế.
Với câu hỏi thông thường, hãy trò chuyện một cách tự nhiên.
`;
    
    // Initialize Elasticsearch connection
    this.initElasticsearch();
  }

  async initElasticsearch() {
    try {
      const isConnected = await elasticsearchService.testConnection();
      const indexExists = await elasticsearchService.checkIndex();
      
      if (isConnected && indexExists) {
        console.log('✅ Elasticsearch ready');
        this.elasticsearchReady = true;
      } else {
        console.log('⚠️ Elasticsearch not ready - using Gemini only');
        this.elasticsearchReady = false;
      }
    } catch (error) {
      console.error('Elasticsearch init failed:', error);
      this.elasticsearchReady = false;
    }
  }

  // CHỈ lọc những câu hỏi thật sự cơ bản
  isBasicGreeting(query) {
    const normalizedQuery = query.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/[đ]/g, 'd');

    // Chỉ các câu chào hỏi, cảm ơn cơ bản
    const basicPhrases = [
      'xin chao', 'chao ban', 'hello', 'hi',
      'cam on', 'thank you', 'thanks',
      'tam biet', 'bye', 'goodbye',
      'ban la ai', 'ban ten gi', 'gioi thieu',
      'ban co the', 'ban lam gi',
      'ok', 'duoc', 'good', 'tot'
    ];

    // Câu ngắn (dưới 20 ký tự) và chỉ chứa greeting
    if (query.length <= 20) {
      const isBasic = basicPhrases.some(phrase => 
        normalizedQuery.includes(phrase) || normalizedQuery === phrase
      );
      
      if (isBasic) {
        console.log('💬 Basic greeting detected:', query);
        return true;
      }
    }

    console.log('🔍 Not a basic greeting, will search knowledge base');
    return false;
  }

  async generateResponse(messages) {
    try {
      // Lấy câu hỏi mới nhất
      const lastMessage = messages[messages.length - 1];
      const userQuery = lastMessage?.content || '';

      console.log('Processing query:', userQuery);

      let knowledgeContext = '';
      let searchResults = [];
      let responseType = 'general';

      // LOGIC ĐƠN GIẢN:
      // 1. Nếu là câu chào cơ bản → dùng general mode
      if (this.isBasicGreeting(userQuery)) {
        console.log('💬 Using general conversation mode');
        responseType = 'general';
      }
      // 2. Tất cả câu hỏi khác → tìm Elasticsearch trước
      else if (this.elasticsearchReady) {
        try {
          console.log('🔍 Searching Elasticsearch for all non-basic queries...');
          searchResults = await elasticsearchService.searchKnowledge(userQuery, 5);
          
          if (searchResults.length > 0) {
            knowledgeContext = this.buildKnowledgeContext(searchResults);
            responseType = 'knowledge_expert';
            console.log(`✅ Found ${searchResults.length} relevant documents from knowledge base`);
          } else {
            console.log('ℹ️ No documents found in Elasticsearch, using general Gemini');
            responseType = 'general';
          }
        } catch (searchError) {
          console.error('❌ Elasticsearch search error:', searchError);
          console.log('🔄 Falling back to general Gemini');
          responseType = 'general';
        }
      }
      // 3. Nếu Elasticsearch không available → dùng general
      else {
        console.log('⚠️ Elasticsearch not available - using general Gemini');
        responseType = 'general';
      }

      // Tạo context từ lịch sử chat
      const recentMessages = messages.slice(-6);
      const chatHistory = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'Người dùng' : 'QuailCare AI'}: ${msg.content}`
      ).join('\n');

      // Tạo prompt
      const prompt = this.buildPrompt(chatHistory, knowledgeContext, userQuery, responseType);

      console.log(`🤖 Calling Gemini API (${responseType} mode)...`);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Log response info
      console.log('✅ Gemini response generated successfully');
      console.log('📊 Response stats:', {
        type: responseType,
        hasKnowledgeBase: searchResults.length > 0,
        elasticsearchReady: this.elasticsearchReady
      });

      return {
        content: aiResponse,
        sources: searchResults.length > 0 ? searchResults.slice(0, 3) : null,
        hasKnowledgeBase: searchResults.length > 0,
        responseType: responseType
      };

    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      let fallbackMessage = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      
      if (error.message.includes('API key')) {
        fallbackMessage = 'Có vấn đề với cấu hình AI. Vui lòng liên hệ quản trị viên.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        fallbackMessage = 'Đã đạt giới hạn sử dụng AI. Vui lòng thử lại sau ít phút.';
      }
      
      throw new Error(fallbackMessage);
    }
  }

  // Xây dựng context từ kết quả Elasticsearch
  buildKnowledgeContext(searchResults) {
    const context = searchResults.map((result, index) => {
      let content = result.content;
      
      // Ưu tiên highlights nếu có
      if (result.highlights && result.highlights.length > 0) {
        content = result.highlights.join('... ');
      }

      // Giới hạn độ dài content
      if (content.length > 400) {
        content = content.substring(0, 400) + '...';
      }

      // Bỏ các trích dẫn số [1], [2], [3]... 
      content = content.replace(/\[\d+\]/g, '');
      
      // Bỏ các dấu citation khác
      content = content.replace(/\(\s*\d+\\s*\)/g, '');
      content = content.replace(/\d+\s*\./g, ''); // Bỏ "1. ", "2. "
      
      // Clean up extra spaces
      content = content.replace(/\s+/g, ' ').trim();

      return `${content}`;
    }).join('\n\n');

    return context;
  }

  // Xây dựng prompt đơn giản hơn
  buildPrompt(chatHistory, knowledgeContext, userQuery, responseType) {
    let prompt = this.systemPrompt;

    if (responseType === 'knowledge_expert') {
      prompt += `\n\n🎯 CHUYÊN GIA với cơ sở dữ liệu:`;
      prompt += `\n\nTHÔNG TIN TỪ TÀI LIỆU CHUYÊN MÔN:\n${knowledgeContext}`;
      prompt += `\n\nHãy sử dụng thông tin trên để trả lời chính xác và thực tế. Khi trả lời, hãy tự nhiên và không cần trích dẫn số. Ở cuối câu trả lời, hãy ghi: "Nguồn: BỘ NÔNG NGHIỆP VÀ PHÁT TRIỂN NÔNG THÔN"`;
    } else {
      prompt += `\n\n💬 TRỢ LÝ THÔNG MINH:`;
      prompt += `\n\nHãy trả lời một cách thân thiện và hữu ích dựa trên kiến thức chung.`;
    }

    // Thêm lịch sử trò chuyện
    if (chatHistory) {
      prompt += `\n\nLỊCH SỬ:\n${chatHistory}`;
    }

    prompt += `\n\nCÂU HỎI: "${userQuery}"`;

    if (responseType === 'knowledge_expert') {
      prompt += `\n\n📝 Trả lời dựa trên thông tin tài liệu, đưa ra lời khuyên cụ thể có thể áp dụng ngay. Viết tự nhiên, không dùng trích dẫn số. Cuối cùng ghi nguồn từ Bộ Nông nghiệp và Phát triển Nông thôn.`;
    } else {
      prompt += `\n\n📝 Trả lời thân thiện và hữu ích.`;
    }

    return prompt;
  }
}

module.exports = new GeminiService();