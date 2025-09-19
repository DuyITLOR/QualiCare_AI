import React, { useState } from "react"
import { 
  FaChevronDown, FaUser, FaPhone, FaSearch, 
  FaRegCommentDots, FaUsers, FaEye, FaClock, 
  FaThumbtack, FaStar, FaUserCircle, FaArrowLeft,
  FaBars, FaTimes
} from "react-icons/fa"
import Header from '../Components/Header'

const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      <Header />

      {/* Mobile Header */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="flex justify-between items-center py-3 px-4">
          {/* Back button and title */}
          <div className="flex items-center gap-3">
            {(selectedCategory || selectedPost) && (
              <button 
                onClick={selectedPost ? handleBackToCategory : handleBackToForum}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaArrowLeft className="text-[#193701]" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-[#ffc130] md:text-2xl">
                {selectedPost ? 'Bài viết' : selectedCategory ? selectedCategory.title : 'Diễn đàn'}
              </h2>
              {selectedCategory && !selectedPost && (
                <p className="text-xs text-gray-500 md:hidden">{selectedCategory.posts} bài viết</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaSearch className="text-gray-600" />
            </button>
            <button className="bg-[#193701] text-white px-3 py-2 rounded-lg text-sm">
              Tạo
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="px-4 pb-3">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Desktop Search Bar */}
        <div className="hidden md:flex justify-between items-center py-6 px-6">
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

      {/* Content */}
      <div className="p-4 md:max-w-7xl md:mx-auto md:py-8 md:px-6">
        {selectedPost ? (
          // Post Detail View
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h1 className="text-xl font-bold text-[#ffc130] mb-2 md:text-3xl">{selectedPost.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <FaUserCircle className="w-4 h-4" />
                <span>{selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.time}</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{selectedPost.content}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-bold text-[#ffc130] flex items-center gap-2">
                  <FaRegCommentDots />
                  Thảo luận ({selectedPost.comments.length})
                </h3>
              </div>
              <div className="divide-y">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <FaUserCircle className="w-8 h-8 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-[#193701] text-sm">{comment.author}</p>
                          <p className="text-xs text-gray-500">{comment.time}</p>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedCategory ? (
          // Category Posts View
          <div className="space-y-3">
            {/* Category description - hidden on mobile */}
            <div className="hidden md:block bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>
            
            {categoryPosts.map(post => (
              <div key={post.id} onClick={() => handlePostClick(post)} 
                   className="bg-white p-4 rounded-lg shadow-sm active:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#ffc130] flex items-center gap-2 mb-1">
                      {post.isPinned && <FaThumbtack className="text-orange-500 w-3 h-3" />}
                      <span className="line-clamp-2">{post.title}</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaRegCommentDots className="w-3 h-3" /> {post.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" /> {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Main Forum View
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#ffc130] mb-3 md:text-xl">
                <FaRegCommentDots /> Danh mục diễn đàn
              </h3>
              <div className="space-y-3">
                {forumCategories.map(cat => (
                  <div key={cat.id} onClick={() => handleCategoryClick(cat)} 
                       className="bg-white p-4 rounded-lg shadow-sm active:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-[#ffc130] mb-1">{cat.title}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{cat.description}</p>
                        <p className="text-xs text-gray-500">{cat.topics} chủ đề • {cat.posts} bài viết</p>
                      </div>
                      <div className="text-right text-xs text-gray-500 ml-3 flex-shrink-0">
                        <p>{cat.lastPost}</p>
                        <p className="font-medium text-[#ffc130]">{cat.lastUser}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#ffc130] mb-3 md:text-xl">
                <FaClock /> Bài viết gần đây
              </h3>
              <div className="space-y-3">
                {recentPosts.map(post => (
                  <div key={post.id} onClick={() => handlePostClick(post)} 
                       className="bg-white p-4 rounded-lg shadow-sm active:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#ffc130] flex items-center gap-2 mb-1">
                          {post.isPinned && <FaThumbtack className="text-orange-500 w-3 h-3" />}
                          <span className="line-clamp-2">{post.title}</span>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className="italic">{post.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaRegCommentDots className="w-3 h-3" /> {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaEye className="w-3 h-3" /> {post.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8">
        <button className="bg-[#193701] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center">
          <FaPhone className="text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  )
}

export default Forum
