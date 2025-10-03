class ElasticsearchService {
  constructor() {
    this.baseUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
    this.indexName = 'knowledge';
  }

  // Preprocess query để cải thiện tìm kiếm
  preprocessQuery(query) {
    // Normalize Vietnamese text
    let processedQuery = query.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/[đ]/g, 'd');

    // Từ khóa bệnh và y tế chuyên môn
    const medicalTerms = {
      'newcastle': 'newcastle niu_cat_xon benh_dich_ta',
      'niu cat xon': 'newcastle niu_cat_xon benh_dich_ta',
      'benh newcastle': 'newcastle niu_cat_xon benh_dich_ta',
      'benh dich ta': 'newcastle niu_cat_xon benh_dich_ta',
      'phong benh': 'phong_benh vaccine tiem_phong',
      'chong benh': 'phong_benh vaccine tiem_phong',
      'phong chong benh': 'phong_benh vaccine tiem_phong',
      'vaccine': 'vaccine tiem_phong phong_benh',
      'tiem phong': 'vaccine tiem_phong phong_benh',
      'lasota': 'lasota vaccine newcastle',
      'coccidiosis': 'coccidiosis cau_trung benh_ky_sinh',
      'tu huyet trung': 'tu_huyet_trung septicemia',
      'ngo doc thuc an': 'ngo_doc_thuc_an nam_moc',
      'nam moc': 'nam_moc ngo_doc_thuc_an',
      'suy dinh duong': 'suy_dinh_duong thieu_chat_dinh_duong',
      'sung mat': 'sung_mat thieu_vitamin_a',
      'bai liet': 'bai_liet thieu_canxi_photpho'
    };

    // Thêm underscore cho các thuật ngữ chăn nuôi cút
    const quailTerms = {
      'chim cut': 'chim_cut',
      'cut con': 'cut_con',
      'cut giong': 'cut_giong',
      'cut de': 'cut_de', 
      'cut thit': 'cut_thit',
      'nuoi cut': 'nuoi_cut',
      'chan nuoi': 'chan_nuoi',
      'thuc an': 'thuc_an',
      'chuong nuoi': 'chuong_nuoi',
      'ap trung': 'ap_trung',
      'um cut': 'um_cut',
      'benh cut': 'benh_cut',
      'vaccine cut': 'vaccine_cut',
      'trang trai': 'trang_trai',
      'nhiet do': 'nhiet_do',
      'do am': 'do_am',
      'thong gio': 'thong_gio',
      'anh sang': 'anh_sang',
      'dinh duong': 'dinh_duong',
      'phong benh': 'phong_benh',
      'chua benh': 'chua_benh'
    };

    // Apply medical terms first (ưu tiên các thuật ngữ y tế)
    Object.keys(medicalTerms).forEach(term => {
      const regex = new RegExp(term, 'gi');
      processedQuery = processedQuery.replace(regex, medicalTerms[term]);
    });

    // Then apply general quail terms
    Object.keys(quailTerms).forEach(term => {
      const regex = new RegExp(term, 'gi');
      processedQuery = processedQuery.replace(regex, quailTerms[term]);
    });

    // Cắt query thành các từ khóa chính
    const keywords = processedQuery
      .split(/[^\w_]+/)
      .filter(word => word.length > 2)
      .slice(0, 15); // Tăng lên 15 từ khóa cho truy vấn y tế

    console.log('Original query:', query);
    console.log('Processed keywords:', keywords);

    return keywords.join(' ');
  }

  async searchKnowledge(query, size = 5) {
    try {
      const processedQuery = this.preprocessQuery(query);
      
      console.log('🔍 Searching Elasticsearch with query:', processedQuery);

      // Enhanced search với multiple strategies
      const searchBody = {
        size: size,
        query: {
          bool: {
            should: [
              // Exact phrase match - highest priority
              {
                match_phrase: {
                  body: {
                    query: processedQuery,
                    boost: 5.0
                  }
                }
              },
              // Match with fuzziness for typos
              {
                match: {
                  body: {
                    query: processedQuery,
                    boost: 3.0,
                    fuzziness: "AUTO"
                  }
                }
              },
              // Individual keywords
              {
                bool: {
                  should: processedQuery.split(' ').map(keyword => ({
                    match: {
                      body: {
                        query: keyword,
                        boost: 2.0
                      }
                    }
                  }))
                }
              },
              // Wildcard search for partial matches
              {
                wildcard: {
                  body: {
                    value: `*${processedQuery.replace(/\s+/g, '*')}*`,
                    boost: 1.0
                  }
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        highlight: {
          fields: {
            body: {
              fragment_size: 200,
              number_of_fragments: 3
            }
          }
        }
      };

      // Gọi Elasticsearch API trực tiếp với fetch
      const response = await fetch(`${this.baseUrl}/${this.indexName}/_search?pretty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
      });

      if (!response.ok) {
        throw new Error(`Elasticsearch HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Elasticsearch found ${data.hits.hits.length} results`);

      // Parse kết quả
      return data.hits.hits.map(hit => ({
        score: hit._score,
        content: hit._source.body,
        highlights: hit.highlight?.body || []
      }));

    } catch (error) {
      console.error('❌ Elasticsearch search error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('🔌 Cannot connect to Elasticsearch. Is it running on', this.baseUrl, '?');
      }
      
      return [];
    }
  }

  // Test connection method
  async testConnection() {
    try {
      console.log('🔍 Testing Elasticsearch connection...');
      
      const response = await fetch(`${this.baseUrl}/_cluster/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const health = await response.json();
        console.log('✅ Elasticsearch connection successful, status:', health.status);
        return true;
      } else {
        console.error('❌ Elasticsearch health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Elasticsearch connection failed:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('🔌 Cannot connect to Elasticsearch. Make sure it\'s running on', this.baseUrl);
      }
      
      return false;
    }
  }

  // Kiểm tra index có tồn tại không
  async checkIndex() {
    try {
      console.log('🔍 Checking index:', this.indexName);
      
      const response = await fetch(`${this.baseUrl}/${this.indexName}`, {
        method: 'HEAD'
      });

      const exists = response.ok;
      console.log(`📊 Index ${this.indexName} exists:`, exists);
      return exists;
    } catch (error) {
      console.error('❌ Error checking index:', error.message);
      return false;
    }
  }

  // Method để test search trực tiếp (for debugging)
  async testSearch(query = 'chuồng nuôi chim_cút') {
    console.log('🧪 Testing search with query:', query);
    
    try {
      const results = await this.searchKnowledge(query, 3);
      console.log('🔍 Test search results:');
      
      results.forEach((result, index) => {
        console.log(`\n📄 Result ${index + 1} (score: ${result.score.toFixed(2)}):`);
        console.log('Content:', result.content.substring(0, 200) + '...');
        
        if (result.highlights.length > 0) {
          console.log('Highlights:', result.highlights[0]);
        }
      });
      
      return results;
    } catch (error) {
      console.error('❌ Test search failed:', error);
      return [];
    }
  }
}

module.exports = new ElasticsearchService();
