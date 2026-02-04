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

      {/* Single Forum Header - Mobile và Desktop chung */}
      <div className="bg-white border-b sticky top-16 z-10">
        {/* Mobile Header */}
        <div className="md:hidden">
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
                <h2 className="text-lg font-bold text-[#ffc130]">
                  {selectedPost ? 'Bài viết' : selectedCategory ? selectedCategory.title : 'Diễn đàn'}
                </h2>
                {selectedCategory && !selectedPost && (
                  <p className="text-xs text-gray-500">{selectedCategory.posts} bài viết</p>
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
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
            <div className="flex items-center gap-4">
              {(selectedCategory || selectedPost) && (
                <button 
                  onClick={selectedPost ? handleBackToCategory : handleBackToForum}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaArrowLeft className="text-[#193701]" />
                </button>
              )}
              <h2 className="text-3xl font-bold text-[#ffc130]">
                {selectedPost ? 'Bài viết' : selectedCategory ? selectedCategory.title : 'Diễn đàn QuailCare AI'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ffc130]"
                />
              </div>
              <button className="bg-[#193701] text-white px-6 py-2 rounded-lg hover:bg-[#2a5002] transition-colors">
                Tạo bài viết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:py-8 md:px-6">
        {selectedPost ? (
          // Post Detail View
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h1 className="text-xl md:text-3xl font-bold text-[#ffc130] mb-2 md:mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <FaUserCircle className="w-4 h-4" />
                <span>{selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.time}</span>
              </div>
              <p className="text-gray-800 leading-relaxed md:text-lg">
                {selectedPost.content}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b md:px-6 md:py-4">
                <h3 className="font-bold text-[#ffc130] flex items-center gap-2 md:text-lg">
                  <FaRegCommentDots />
                  Thảo luận ({selectedPost.comments.length})
                </h3>
              </div>
              <div className="divide-y">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <FaUserCircle className="w-8 h-8 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-[#193701] text-sm md:text-base">
                            {comment.author}
                          </p>
                          <p className="text-xs text-gray-500 md:text-sm">
                            {comment.time}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedCategory ? (
          // Category Posts View
          <div className="space-y-3 md:space-y-4">
            {/* Category description - hidden on mobile */}
            <div className="hidden md:block bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">{selectedCategory.description}</p>
            </div>
            
            {categoryPosts.map(post => (
              <div key={post.id} onClick={() => handlePostClick(post)} 
                   className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#ffc130] flex items-center gap-2 mb-1 md:text-lg">
                      {post.isPinned && <FaThumbtack className="text-orange-500 w-3 h-3" />}
                      <span>{post.title}</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
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
          <div className="space-y-6 md:space-y-8">
            {/* Categories */}
            <div>
              <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold text-[#ffc130] mb-3 md:mb-6">
                <FaRegCommentDots /> Danh mục diễn đàn
              </h3>
              <div className="space-y-3 md:space-y-4">
                {forumCategories.map(cat => (
                  <div key={cat.id} onClick={() => handleCategoryClick(cat)} 
                       className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg md:text-xl font-semibold text-[#ffc130] mb-1 md:mb-2">
                          {cat.title}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3">
                          {cat.description}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {cat.topics} chủ đề • {cat.posts} bài viết
                        </p>
                      </div>
                      <div className="text-right text-xs md:text-sm text-gray-500 ml-3 flex-shrink-0">
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
              <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold text-[#ffc130] mb-3 md:mb-6">
                <FaClock /> Bài viết gần đây
              </h3>
              <div className="space-y-3 md:space-y-4">
                {recentPosts.map(post => (
                  <div key={post.id} onClick={() => handlePostClick(post)} 
                       className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#ffc130] flex items-center gap-2 mb-1 md:text-lg">
                          {post.isPinned && <FaThumbtack className="text-orange-500 w-3 h-3" />}
                          <span>{post.title}</span>
                        </h4>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className="italic">{post.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
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
        <button className="bg-[#193701] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#2a5002] transition-colors">
          <FaPhone className="text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  )
}

export default Forum