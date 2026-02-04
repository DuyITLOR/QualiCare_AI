// insertUser.js

import { createClient } from '@supabase/supabase-js';

// 👇 Thay bằng URL và KEY của bạn từ Supabase Project Settings → API
const supabaseUrl = 'postgresql://postgres.xfravzcdukiovvmzpxus:Khoi10012005@123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const supabaseKey = 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertUser() {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { email: 'hello@example.com', name: 'John Doe' }
    ]);

  if (error) {
    console.error('❌ Lỗi:', error);
  } else {
    console.log('✅ Đã thêm:', data);
  }
}

insertUser();
