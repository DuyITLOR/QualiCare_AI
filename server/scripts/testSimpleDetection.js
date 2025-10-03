require('dotenv').config();
const geminiService = require('../services/geminiService');

async function testSimpleDetection() {
  console.log('🧪 Testing Simple Detection Logic...\n');
  
  const testQueries = [
    // Câu chào cơ bản → general
    'xin chào',
    'hi',
    'cảm ơn',
    'bạn là ai?',
    'ok',
    
    // Tất cả câu hỏi khác → search ES first
    'làm sao để xây chuồng cút',
    'thức ăn cho cút con',
    'bệnh newcastle',
    'cách làm bánh',
    'thời tiết hôm nay',
    'học lập trình',
    'cách chăn nuôi gia súc',
    'công nghệ blockchain'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🔍 Testing: "${query}"`);
    const isBasic = geminiService.isBasicGreeting(query);
    
    if (isBasic) {
      console.log('   → 💬 BASIC GREETING (use general mode)');
    } else {
      console.log('   → 🔍 SEARCH ELASTICSEARCH FIRST');
    }
  }
  
  console.log('\n🎉 Simple detection test completed!');
  console.log('\n📋 Logic Summary:');
  console.log('   💬 Basic greetings → General conversation');
  console.log('   🔍 All other queries → Search Elasticsearch first');
  console.log('   ⚠️  No ES results → Fallback to general Gemini');
}

// Run test
testSimpleDetection().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
