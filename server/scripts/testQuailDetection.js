require('dotenv').config();
const geminiService = require('../services/geminiService');

async function testQuailDetection() {
  console.log('🧪 Testing Quail Question Detection...\n');
  
  const testQueries = [
    // Câu hỏi về chuồng cút
    'làm sao để xây chuồng cút',
    'cách thiết kế chuồng nuôi cút',
    'xây dựng chuồng chăn nuôi cút',
    'làm chuồng nuôi chim cút',
    
    // Câu hỏi kỹ thuật
    'thức ăn cho cút con',
    'cách úm cút hiệu quả',
    'bệnh newcastle ở cút',
    'nhiệt độ ấp trứng cút',
    
    // Câu hỏi chăn nuôi chung có thể về cút
    'cách chăn nuôi gia cầm',
    'làm trang trại nuôi',
    'kỹ thuật ấp nở',
    'dinh dưỡng cho gia cầm',
    
    // Câu hỏi không liên quan
    'thời tiết hôm nay thế nào',
    'cách nấu cơm',
    'học lập trình như thế nào',
    'giá vàng bao nhiêu'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🔍 Testing: "${query}"`);
    const isQuailRelated = geminiService.isQuailRelated(query);
    console.log(`   Result: ${isQuailRelated ? '✅ QUAIL-RELATED' : '❌ NOT QUAIL-RELATED'}`);
  }
  
  console.log('\n🎉 Detection test completed!');
}

// Run test
testQuailDetection().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
