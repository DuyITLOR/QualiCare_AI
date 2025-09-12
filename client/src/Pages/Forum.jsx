import React, { useState } from "react"
import { 
  FaChevronDown, FaUser, FaPhone, FaSearch, 
  FaRegCommentDots, FaUsers, FaEye, FaClock, 
  FaThumbtack, FaStar, FaUserCircle
} from "react-icons/fa"
import Header from '../Components/header'


const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const forumCategories = [
    {
      id: 1,
      title: "Kỹ thuật chăn nuôi cút",
      description: "Thảo luận về các kỹ thuật chăn nuôi, chăm sóc và quản lý đàn cút",
      posts: 245,
      topics: 67,
      lastPost: "2 giờ trước",
      lastUser: "Nguyễn Văn A",
      color: "#FFB22C",
    },
    {
      id: 2,
      title: "Công nghệ thông minh",
      description: "Chia sẻ về ứng dụng AI và IoT trong chăn nuôi cút",
      posts: 189,
      topics: 43,
      lastPost: "5 giờ trước",
      lastUser: "Trần Thị B",
      color: "#854836",
    },
  ]

  const recentPosts = [
    {
      id: 1,
      title: "Cách phòng chống bệnh Newcastle ở cút con",
      author: "Nguyễn Văn A",
      replies: 12,
      views: 234,
      time: "2 giờ trước",
      isPinned: true,
      category: "Kỹ thuật chăn nuôi cút",
    },
    {
      id: 2,
      title: "Ứng dụng cảm biến nhiệt độ tự động trong chuồng nuôi",
      author: "Trần Thị B",
      replies: 8,
      views: 156,
      time: "4 giờ trước",
      isPinned: false,
      category: "Công nghệ thông minh",
    },
  ]

  // Hardcoded posts for a selected category
  const categoryPosts = [
    {
      id: 101,
      title: "Thảo luận về cách úm cút con hiệu quả",
      author: "Lê Thị C",
      replies: 25,
      views: 512,
      time: "1 ngày trước",
      isPinned: true,
    },
    {
      id: 102,
      title: "Kinh nghiệm chọn giống cút đẻ trứng sai",
      author: "Phạm Văn D",
      replies: 18,
      views: 430,
      time: "3 ngày trước",
      isPinned: false,
    },
  ];

  // Hardcoded post detail with comments
  const postDetail = {
    id: 101,
    title: "Thảo luận về cách úm cút con hiệu quả",
    author: "Lê Thị C",
    time: "1 ngày trước",
    content: "Chào mọi người, em là người mới bắt đầu nuôi cút. Em đang gặp khó khăn trong giai đoạn úm cút con, tỷ lệ hao hụt còn khá cao. Mọi người có kinh nghiệm hay kỹ thuật nào hiệu quả có thể chia sẻ cho em và mọi người cùng học hỏi được không ạ? Em cảm ơn nhiều!",
    comments: [
      { id: 1, author: "Phạm Văn D", time: "23 giờ trước", text: "Bạn cần đảm bảo nhiệt độ chuồng úm luôn ổn định ở mức 35-37°C trong tuần đầu tiên, sau đó giảm dần. Dùng bóng đèn sợi đốt là dễ nhất. Lót chuồng bằng trấu khô và sạch nhé." },
      { id: 2, author: "Trần Thị B", time: "18 giờ trước", text: "Đúng rồi, nhiệt độ là quan trọng nhất. Ngoài ra bạn cũng nên chú ý mật độ nuôi, không nên quá dày. Cho cút uống nước có pha vitamin C hoặc điện giải trong những ngày đầu để tăng sức đề kháng." },
      { id: 3, author: "Lê Thị C", time: "15 giờ trước", text: "Dạ em cảm ơn hai bác nhiều ạ. Em sẽ điều chỉnh lại nhiệt độ và mật độ xem sao." },
    ]
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedPost(null);
  };

  const handlePostClick = (post) => {
    // In a real app, you would fetch post details based on post.id
    setSelectedPost(postDetail); 
  };

  const handleBackToCategory = () => {
    setSelectedPost(null);
  };

  const handleBackToForum = () => {
    setSelectedCategory(null);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <header>
        <Header/>
      </header>

      {/* Search + Create Post */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
          <h2 className="text-2xl font-bold text-[#ffc130]">Diễn đàn QuailCare AI</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              />
            </div>
            <button className="bg-[#193701] text-white px-4 py-2 rounded-lg">Tạo bài viết</button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs & Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-4">
          <span onClick={handleBackToForum} className="hover:underline cursor-pointer text-[#193701]">Diễn đàn</span>
          {selectedCategory && 
            <>
              <span className="mx-2">&gt;</span>
              <span onClick={handleBackToCategory} className={`${selectedPost ? 'hover:underline cursor-pointer text-[#193701]' : ''}`}>{selectedCategory.title}</span>
            </>
          }
          {selectedPost && 
            <>
              <span className="mx-2">&gt;</span>
              <span>{selectedPost.title}</span>
            </>
          }
        </div>

        {selectedPost ? (
          // Post Detail View
          <div>
            <h2 className="text-3xl font-bold text-[#ffc130] mb-2">{selectedPost.title}</h2>
            <p className="text-sm text-gray-500 mb-6">
              bởi {selectedPost.author} • {selectedPost.time}
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <p className="text-gray-800 leading-relaxed">{selectedPost.content}</p>
            </div>

            <h3 className="text-xl font-bold text-[#ffc130] mb-4">Thảo luận ({selectedPost.comments.length})</h3>
            <div className="space-y-4">
              {selectedPost.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <FaUserCircle className="w-8 h-8 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#193701]">{comment.author}</p>
                    <p className="text-sm text-gray-500 mb-2">{comment.time}</p>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedCategory ? (
          // Category Detail View
          <div>
            <button onClick={handleBackToCategory} className="text-[#193701] font-semibold mb-4 hover:underline">
              &larr; Quay lại danh mục
            </button>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-[#ffc130] mb-2">
              {selectedCategory.title}
            </h3>
            <p className="text-gray-600 mb-6">{selectedCategory.description}</p>
            
            {/* Posts in the category */}
            {categoryPosts.map(post => (
              <div key={post.id} onClick={() => handlePostClick(post)} className="bg-white p-4 mb-2 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#ffc130] flex items-center gap-2">
                      {post.isPinned && <FaThumbtack className="text-orange-500" />}
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      bởi {post.author} • {post.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><FaRegCommentDots /> {post.replies}</span>
                    <span className="flex items-center gap-1"><FaEye /> {post.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Main Forum View
          <>
            <h3 className="flex items-center gap-2 text-xl font-bold text-[#ffc130] mb-4">
              <FaRegCommentDots /> Danh mục diễn đàn
            </h3>
            {forumCategories.map(cat => (
              <div key={cat.id} onClick={() => handleCategoryClick(cat)} className="bg-white p-4 mb-4 rounded-lg shadow-sm flex justify-between cursor-pointer hover:shadow-md transition-shadow">
                <div>
                  <h4 className="text-lg font-semibold text-[#ffc130]">{cat.title}</h4>
                  <p className="text-gray-600">{cat.description}</p>
                  <p className="text-sm text-gray-500">{cat.topics} chủ đề • {cat.posts} bài viết</p>
                </div>
                <div className="text-right text-sm">
                  <p>{cat.lastPost}</p>
                  <p className="font-medium text-[#ffc130]">{cat.lastUser}</p>
                </div>
              </div>
            ))}

            {/* Recent Posts */}
            <h3 className="flex items-center gap-2 text-xl font-bold text-[#ffc130] mt-8 mb-4">
              <FaClock /> Bài viết gần đây
            </h3>
            {recentPosts.map(post => (
              <div key={post.id} onClick={() => handlePostClick(post)} className="bg-white p-4 mb-2 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#ffc130] flex items-center gap-2">
                      {post.isPinned && <FaThumbtack className="text-orange-500" />}
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      bởi {post.author} • {post.time} • <span className="italic">{post.category}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><FaRegCommentDots /> {post.replies}</span>
                    <span className="flex items-center gap-1"><FaEye /> {post.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-[#193701] w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
          <FaPhone className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default Forum
