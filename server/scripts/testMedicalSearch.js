require('dotenv').config();
const elasticsearchService = require('../services/elasticsearchService');

async function testMedicalSearch() {
  console.log('🧪 Testing Medical Terms Search...\n');
  
  const medicalQueries = [
    // Bệnh Newcastle
    'Phòng chống bệnh Newcastle',
    'bệnh newcastle',
    'niu cát xơn',
    'bệnh dịch tả chim',
    'vaccine lasota',
    
    // Các bệnh khác
    'coccidiosis',
    'tụ huyết trùng',
    'ngộ độc thức ăn',
    'suy dinh dưỡng',
    'sưng mắt',
    'bại liệt',
    
    // Phòng bệnh chung
    'phòng bệnh',
    'tiêm phòng',
    'vaccine',
    'thuốc thú y'
  ];
  
  for (const query of medicalQueries) {
    console.log(`🔍 Testing: "${query}"`);
    
    try {
      const results = await elasticsearchService.searchKnowledge(query, 3);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results`);
        results.forEach((result, index) => {
          console.log(`   📄 Result ${index + 1} (score: ${result.score.toFixed(2)})`);
          console.log(`      ${result.content.substring(0, 150)}...`);
          
          if (result.highlights.length > 0) {
            console.log(`      💡 Highlight: ${result.highlights[0].substring(0, 100)}...`);
          }
        });
      } else {
        console.log('❌ No results found');
      }
      
      console.log(''); // Empty line for separation
      
    } catch (error) {
      console.error(`❌ Error searching "${query}":`, error.message);
    }
  }
  
  console.log('\n🎉 Medical search test completed!');
}

// Run test
testMedicalSearch().then(() => {
  console.log('\n🏁 Test finished');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});
