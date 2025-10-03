require('dotenv').config();
const elasticsearchService = require('../services/elasticsearchService');

async function testElasticsearch() {
  console.log('🚀 Testing Elasticsearch Connection and Search...\n');
  
  try {
    // Test 1: Connection
    console.log('📡 Testing connection...');
    const connected = await elasticsearchService.testConnection();
    
    if (!connected) {
      console.error('❌ Cannot connect to Elasticsearch. Please check:');
      console.error('   1. Elasticsearch is running');
      console.error('   2. URL is correct:', process.env.ELASTICSEARCH_URL || 'http://localhost:9200');
      return;
    }
    
    // Test 2: Index exists
    console.log('\n📊 Checking index...');
    const indexExists = await elasticsearchService.checkIndex();
    
    if (!indexExists) {
      console.warn('⚠️  Index "knowledge" does not exist. Please create it first.');
      console.log('💡 You can create index using MedQA setup or manual commands.');
      return;
    }
    
    // Test 3: Search functionality
    console.log('\n🔍 Testing search functionality...');
    
    const testQueries = [
      'chuồng nuôi chim_cút',
      'thức ăn cút',
      'bệnh Newcastle',
      'nhiệt độ úm cút'
    ];
    
    for (const query of testQueries) {
      console.log(`\n🧪 Testing query: "${query}"`);
      const results = await elasticsearchService.searchKnowledge(query, 2);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results`);
        results.forEach((result, index) => {
          console.log(`   📄 Result ${index + 1} (score: ${result.score.toFixed(2)})`);
          console.log(`      ${result.content.substring(0, 100)}...`);
        });
      } else {
        console.log('ℹ️  No results found');
      }
    }
    
    console.log('\n🎉 Elasticsearch test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testElasticsearch().then(() => {
  console.log('\n🏁 Test finished');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});
